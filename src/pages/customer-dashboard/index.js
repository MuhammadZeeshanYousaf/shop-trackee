import { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, Grid, Box, Typography, Dialog } from '@mui/material'
import { AnalyticsSlider, Map, showErrorMessage, CustomerProductCard } from '../../components'
import { useLoader, useCoordinates } from 'src/hooks'
import { Network, Url } from 'src/configs'
import ServiceCard from '../shop/products-and-services/ServiceCard'
import ProductCard from '../shop/products-and-services/ProductCard'
import { useRouter } from 'next/router'

const CustomerDashboard = () => {
  const { setLoader } = useLoader()
  const { setCoordinates, latitude, longitude } = useCoordinates()
  const router = useRouter()
  // const [longitude, setLongitude] = useState(null)
  // const [latitude, setLatitude] = useState(null)
  const [productCategories, setProductCategories] = useState([])
  const [serviceCategories, setServiceCategories] = useState([])
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [location, setLocation] = useState({
    longitude: '',
    latitude: ''
  })

  const distance = localStorage.getItem('distance')

  const getCustomerDashboard = async (longitude, latitude) => {
    setLoader(true)
    const response = await Network.get(Url.customeDashboard(localStorage.getItem('distance'), longitude, latitude))
    setLoader(false)

    setProductCategories(response.data.product.categories)
    setServiceCategories(response.data.service.categories)
    setProducts(response.data.product.data)
    setServices(response.data.service.data)
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLoader(true)
        setCoordinates(position?.coords?.longitude, position?.coords?.latitude)
        setLoader(false)
        getCustomerDashboard(position?.coords?.longitude, position?.coords?.latitude)
      }),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
    } else {
      showErrorMessage('It is better to select location')
      getCustomerDashboard('', '')
    }
  }, [])

  // useEffect(() => {}, [])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <AnalyticsSlider />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <Map latitude={latitude} longitude={longitude} height='227px' />
          </Card>
        </Grid>
      </Grid>
      <Card sx={{ mt: 5 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '20px',
            paddingRight: '20px',
            paddingTop: '20px'
          }}
        >
          <Typography variant='h4'>Products</Typography>
          <Button
            size='small'
            onClick={() =>
              router.push(
                `/fetch-products?longitude=${longitude}&latitude=${latitude}&distance=${distance}&product_page=1`
              )
            }
          >
            View All
          </Button>
        </div>

        <div className='scroll-container'>
          {productCategories.map(category => (
            <div style={{ marginLeft: '20px', marginRight: '20px' }}>{category}</div>
          ))}
        </div>
        <CardContent>
          <Grid container spacing={5}>
            {products?.map((product, i) => (
              <Grid item xs={12} sm={6} md={4}>
                <CustomerProductCard product={product} key={i} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 5 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '20px',
            paddingRight: '20px',
            paddingTop: '20px'
          }}
        >
          <Typography variant='h4'>Services</Typography>
          <Button
            size='small'
            onClick={() =>
              router.push(
                `/fetch-services?longitude=${longitude}&latitude=${latitude}&distance=${distance}&product_page=1`
              )
            }
          >
            View All
          </Button>
        </div>
        <CardContent>
          <div className='scroll-container'>
            {serviceCategories.map(category => (
              <Button size='small'>{category}</Button>
            ))}
          </div>
          <Grid container spacing={5}>
            {services?.map((service, i) => (
              <Grid xs={12} lg={6} item>
                <ServiceCard service={service} key={i} deleteService={() => {}} shopId={1} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

CustomerDashboard.acl = {
  subject: 'customer-dashboard',
  action: 'read'
}

export default CustomerDashboard
