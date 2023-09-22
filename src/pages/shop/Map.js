import React, { useEffect, useState, useCallback } from 'react'
import { useLoader } from 'src/hooks'
import { GoogleMap, useJsApiLoader, Marker, LoadScript } from '@react-google-maps/api'

const Map = ({ longitude, latitude }) => {
  console.log({ longitude })
  console.log({ latitude })

  const center = {
    lat: latitude,
    lng: longitude
  }
  // const center = {
  //   lat: 51.5072178,
  //   lng: -0.1275862,
  // };

  const containerStyle = {
    width: '100%',
    height: '100vh'
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
