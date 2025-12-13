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
 * Handles connection, reconnection, and vehicle subscriptions
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

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    if (isConnecting) {
      return; // Already connecting
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(IOT_WEBSOCKET_URL);

      ws.onopen = () => {
        console.log('WebSocket connected');
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
        try {
          const data = JSON.parse(event.data);

          // Handle connection confirmation
          if (data.type === 'connected' || data.type === 'subscribed' || data.type === 'unsubscribed') {
            return;
          }

          // Handle vehicle location updates
          if (data.type === 'vehicle-location-received') {
            const update: VehicleLocationUpdate = {
              ...data,
              timestamp: new Date(data.timestamp),
            };
            onMessage?.(update);
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
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        setIsConnecting(false);
        onError?.(event);
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;

        onDisconnect?.();

        // Auto-reconnect if enabled and not a manual disconnect
        if (autoReconnect && shouldReconnectRef.current && event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnecting(false);
    }
  }, [isConnecting, autoReconnect, reconnectInterval, onMessage, onError, onConnect, onDisconnect]);

  /**
   * Subscribe to a specific vehicle
   */
  const subscribe = useCallback((vehicleId: string): void => {
    if (!vehicleId) return;

    subscribedVehiclesRef.current.add(vehicleId);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'subscribe',
          vehicleId,
        })
      );
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

