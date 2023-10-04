import React, { useEffect, useState, useCallback } from 'react'
import { useLoader } from 'src/hooks'
import { GoogleMap, useJsApiLoader, Marker, LoadScript } from '@react-google-maps/api'

const Map = ({ longitude, latitude, height = '100vh' }) => {
  const center = {
    lat: latitude,
    lng: longitude
  }

  const containerStyle = {
    width: '100%',
    height: height
  }
  const [map, setMap] = useState(null)

  return (
    // <LoadScript libraries="places">
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      // Other props here
    >
      <Marker position={{ lat: center.lat, lng: center.lng }} />
    </GoogleMap>
    // </LoadScript>
  )
}

export default Map
