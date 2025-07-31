'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { LatLngExpression } from 'leaflet'

const VehicleTracker = () => {
  // Default position (you can change these coordinates)
  const position: LatLngExpression = [-6.7924, 39.2083]

  useEffect(() => {
    // Fix for Leaflet marker icon issue in Next.js
    const L = require('leaflet')
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
      iconUrl: '/location.svg',
      shadowUrl: 'leaflet/images/marker-shadow.png',
    })
  }, [])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={position}
        zoomControl={true}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A sample vehicle location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default VehicleTracker