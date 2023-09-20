import React, { useEffect, useState, useCallback } from 'react'
import { useLoader } from 'src/hooks'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

const AnyReactComponent = ({ text }) => <div>{text}</div>

const Map = ({ longitude, latitude }) => {
  const center = {
    lat: latitude,
    lng: longitude
  }

  const containerStyle = {
    width: '100%',
    height: '100vh'
  }
  const [map, setMap] = useState(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAPBI4e19Or0KAphAP7v-3QRQwghlG_TkA'
  })

  const onLoad = useCallback(
    function callback(map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      const bounds = new window.google.maps.LatLngBounds(center)
      map.fitBounds(bounds)

      setMap(map)
    },
    [longitude, latitude]
  )

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onLoad={onLoad} onUnmount={onUnmount}>
      {/* Child components, such as markers, info windows, etc. */}
      <>
        <Marker position={{ lat: center.lat, lng: center.lng }} />
      </>
    </GoogleMap>
  ) : (
    <></>
  )
}

export default React.memo(Map)
