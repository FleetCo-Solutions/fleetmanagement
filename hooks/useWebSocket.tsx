'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { IOT_WEBSOCKET_URL } from '@/lib/api/config';

export interface VehicleLocationUpdate {
  type: 'vehicle-location-received';
  vehicleId: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
  };
  source: 'mobile' | 'iot';
  speed?: number;
  heading?: number;
}

interface UseWebSocketOptions {
  vehicleIds?: string[];
  onMessage?: (data: VehicleLocationUpdate) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  subscribe: (vehicleId: string) => void;
  unsubscribe: (vehicleId: string) => void;
  send: (data: any) => void;
  disconnect: () => void;
  reconnect: () => void;
}

/**
 * Custom hook for WebSocket connection to IoT backend
 * Handles connection, reconnection, and vehicle subscriptions.
 *
 * Common close code 1006 (abnormal closure) usually means: server unreachable,
 * TLS/SSL failure, or reverse proxy (nginx) not forwarding WebSocket correctly.
 * Check: wss URL, nginx location /ws proxy_pass, and IoT backend WS server running.
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    vehicleIds = [],
    onMessage,
    onError,
    onConnect,
    onDisconnect,
    autoReconnect = true,
    reconnectInterval = 3000,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribedVehiclesRef = useRef<Set<string>>(new Set());
  const shouldReconnectRef = useRef(true);
  const connectingRef = useRef(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  /**
   * Connect to WebSocket server
   * Uses a ref for "already connecting" guard so connect identity stays stable
   * and the mount effect doesn't disconnect immediately after connecting.
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    if (connectingRef.current) {
      return; // Already connecting
    }

    connectingRef.current = true;
    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(IOT_WEBSOCKET_URL);
      console.log('[WS] Attempting connection to:', IOT_WEBSOCKET_URL);

      ws.onopen = () => {
        console.log('%c[WS] ✅ CONNECTED to', 'color: #10b981; font-weight: bold', IOT_WEBSOCKET_URL);
        console.log('[WS] Currently subscribed vehicles:', [...subscribedVehiclesRef.current]);
        connectingRef.current = false;
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        shouldReconnectRef.current = true;

        // Resubscribe to previously subscribed vehicles
        subscribedVehiclesRef.current.forEach((vehicleId) => {
          subscribe(vehicleId);
        });

        onConnect?.();
      };

      ws.onmessage = (event) => {
        console.log('[WS] RAW MESSAGE received:', event.data.slice(0, 300));
        try {
          const data = JSON.parse(event.data);
          console.log('[WS] Parsed message type:', data.type);

          // Handle connection confirmation
          if (data.type === 'connected' || data.type === 'subscribed' || data.type === 'unsubscribed') {
            console.log('[WS] Control message:', data.type, data);
            return;
          }

          // Handle vehicle location updates
          if (data.type === 'vehicle-location-received') {
            console.log('%c[WS] 📍 LOCATION UPDATE', 'color: #3b82f6; font-weight: bold', {
              vehicleId: data.vehicleId,
              lat: data.location?.latitude,
              lng: data.location?.longitude,
              speed: data.location?.speed,
            });
            const update: VehicleLocationUpdate = {
              ...data,
              timestamp: new Date(data.timestamp),
            };
            onMessageRef.current?.(update);
          }

          // Handle errors
          if (data.type === 'error') {
            console.error('WebSocket error from server:', data.message);
            setError(data.message || 'Unknown error from server');
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        // Event is opaque; actual cause usually appears in onclose (e.g. 1006)
        console.error('[WS] ❌ onerror fired (check onclose for code). URL was:', IOT_WEBSOCKET_URL);
        connectingRef.current = false;
        setError('WebSocket connection error');
        setIsConnecting(false);
        onError?.(event);
      };

      ws.onclose = (event) => {
        connectingRef.current = false;
        console.log('%c[WS] ❌ CLOSED', 'color: #ef4444; font-weight: bold', 'code:', event.code, 'reason:', event.reason || '(none)', 'wasClean:', event.wasClean);
        console.log('[WS] Close code', event.code, '— 1006 = abnormal (server unreachable/TLS/proxy), 1000 = normal close');
        // 1006 = abnormal closure (no close frame: server unreachable, TLS, or proxy)
        const message =
          event.code === 1006
            ? 'Connection lost (will retry)'
            : event.reason || `Connection closed (${event.code})`;
        setError(event.code !== 1000 ? message : null);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;

        onDisconnect?.();

        if (autoReconnect && shouldReconnectRef.current && event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setError(null);
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      connectingRef.current = false;
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnecting(false);
    }
  }, [autoReconnect, reconnectInterval, onError, onConnect, onDisconnect]);

  /**
   * Subscribe to a specific vehicle
   */
  const subscribe = useCallback((vehicleId: string): void => {
    if (!vehicleId) return;

    subscribedVehiclesRef.current.add(vehicleId);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[WS] 📡 Sending SUBSCRIBE for vehicle:', vehicleId);
      wsRef.current.send(
        JSON.stringify({
          type: 'subscribe',
          vehicleId,
        })
      );
    } else {
      console.log('[WS] Subscribe queued (not connected yet) for vehicle:', vehicleId, '— will send on reconnect');
    }
  }, []);

  /**
   * Unsubscribe from a specific vehicle
   */
  const unsubscribe = useCallback((vehicleId: string) => {
    if (!vehicleId) return;

    subscribedVehiclesRef.current.delete(vehicleId);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'unsubscribe',
          vehicleId,
        })
      );
    }
  }, []);

  /**
   * Send custom message to WebSocket server
   */
  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
    }
  }, []);

  /**
   * Disconnect from WebSocket server
   */
  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  /**
   * Manually reconnect to WebSocket server
   */
  const reconnect = useCallback(() => {
    disconnect();
    shouldReconnectRef.current = true;
    setTimeout(() => {
      connect();
    }, 1000);
  }, [connect, disconnect]);

  // Initial connection and vehicle subscriptions
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Subscribe to vehicles when they change
  useEffect(() => {
    if (isConnected && vehicleIds.length > 0) {
      vehicleIds.forEach((vehicleId) => {
        subscribe(vehicleId);
      });
    }
  }, [isConnected, vehicleIds, subscribe]);

  return {
    isConnected,
    isConnecting,
    error,
    subscribe,
    unsubscribe,
    send,
    disconnect,
    reconnect,
  };
}

