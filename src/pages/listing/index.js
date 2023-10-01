import { useEffect, useState } from 'react'
import { Card, CardContent, Grid } from '@mui/material'
import { AnalyticsSlider, Map } from '../../components'
import { useLoader } from 'src/hooks'

const Listing = () => {
  const { setLoader } = useLoader()
  const [longitude, setLongitude] = useState(null)
  const [latitude, setLatitude] = useState(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLoader(true)
        setLongitude(position?.coords?.longitude)
        setLatitude(position?.coords?.latitude)
        setLoader(false)
      }),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
    } else {
      showErrorMessage('It is better to select location')
    }
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={6}>
        <AnalyticsSlider />
      </Grid>
      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Map latitude={latitude} longitude={longitude} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

Listing.acl = {
  subject: 'listing',
  action: 'read'
}

export default Listing
