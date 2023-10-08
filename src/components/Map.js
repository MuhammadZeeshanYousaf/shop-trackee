import React, { useEffect, useState, useCallback } from 'react'
import { useLoader } from 'src/hooks'
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  LoadScript,
  DirectionsService,
  DirectionsRenderer
} from '@react-google-maps/api'

const Map = ({ longitude, latitude, height = '100vh' }) => {
  const center = {
    lat: latitude,
    lng: longitude
  }

  const [directions, SetDirections] = useState(null)

  const containerStyle = {
    width: '100%',
    height: height
  }
  const [map, setMap] = useState(null)

  // const calculateDirection = async () => {
  //   const directionService = new google.maps.DirectionsService()

  //   const result = await directionService.route({
  //     origin: {
  //       lat: latitude,
  //       lng: longitude
  //     },
  //     destination: {
  //       lat: latitude,
  //       lng: longitude
  //     },
  //     travelMode: google.maps.TravelMode.DRIVING,
  //     waypoints: [
  //       {
  //         location: new google.maps.LatLng(6.4698, 3.5852)
  //       },
  //       {
  //         location: new google.maps.LatLng(6.6018, 3.3515)
  //       }
  //     ]
  //   })

  //   console.log({ result })

  //   SetDirections(result)
  // }

  // useEffect(() => {
  //   calculateDirection()
  // }, [])

  return (
    // <LoadScript libraries="places">
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      // Other props here
    >
      <Marker position={{ lat: center.lat, lng: center.lng }} />
      {/* <DirectionsRenderer directions={directions} /> */}
    </GoogleMap>
    // </LoadScript>
  )
}

export default Map
