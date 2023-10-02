import { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, Grid, Box, Typography } from '@mui/material'
import { AnalyticsSlider, Map, showErrorMessage } from '../../components'
import { useLoader } from 'src/hooks'
import { Network, Url } from 'src/configs'

const CustomerDashboard = () => {
  const { setLoader } = useLoader()
  const [longitude, setLongitude] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [categories, setCategories] = useState([])

  const getCategories = async () => {
    setLoader(true)
    const response = await Network.get(Url.getAllCategories)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setCategories(response.data.categories)
  }

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

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <AnalyticsSlider />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <Map latitude={latitude} longitude={longitude} height='29vh' />
          </Card>
        </Grid>
      </Grid>
      <Typography sx={{mt:5}} variant='h4'>Categories</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', overflowX: 'scroll', width: '100%' }}>
        {categories.map(category => (
          <Button sx={{ minWidth: '200px' }}>{category}</Button>
        ))}
      </Box>
    </>
  )
}

CustomerDashboard.acl = {
  subject: 'customer-dashboard',
  action: 'read'
}

export default CustomerDashboard
