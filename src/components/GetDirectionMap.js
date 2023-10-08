import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  LoadScript,
  DirectionsService,
  DirectionsRenderer
} from '@react-google-maps/api'
import { useEffect, useState } from 'react'

const GetDirectionMap = ({ origin, destination }) => {
  const [directions, SetDirections] = useState(null)
  const center = {
    lat: origin?.latitude,
    lng: origin?.longitude
  }

  const containerStyle = {
    width: '100%',
    height: 600
  }

  const calculateDirection = async () => {
    const directionService = new google.maps.DirectionsService()

    const result = await directionService.route({
      origin: {
        lat: origin?.latitude,
        lng: origin?.longitude
      },
      destination: {
        lat: destination?.latitude,
        lng: destination?.longitude
      },
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: [
        {
          location: new google.maps.LatLng(origin?.latitude, origin?.longitude)
        },
        {
          location: new google.maps.LatLng(destination?.latitude, origin?.longitude)
        }
      ]
    })

    SetDirections(result)
  }

  useEffect(() => {
    calculateDirection()
  }, [])

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      // Other props here
    >
      <Marker position={{ lat: center.lat, lng: center.lng }} />
      <DirectionsRenderer directions={directions} />
    </GoogleMap>
  )
}

export default GetDirectionMap
