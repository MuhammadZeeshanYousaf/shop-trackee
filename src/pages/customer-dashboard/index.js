import { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, Grid, Box, Typography } from '@mui/material'
import { AnalyticsSlider, Map, showErrorMessage } from '../../components'
import { useLoader } from 'src/hooks'
import { Network, Url } from 'src/configs'
import ServiceCard from '../shop/products-and-services/ServiceCard'
import ProductCard from '../shop/products-and-services/ProductCard'

const CustomerDashboard = () => {
  const { setLoader } = useLoader()
  const [longitude, setLongitude] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [productCategories, setProductCategories] = useState([])
  const [serviceCategories, setServiceCategories] = useState([])
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])

  const getCustomerDashboard = async () => {
    setLoader(true)
    const response = await Network.get(Url.customeDashboard)
    setLoader(false)

    setProductCategories(response.data.product.categories)
    setServiceCategories(response.data.service.categories)
    setProducts(response.data.product.data)
    setServices(response.data.service.data)
  }

  // const getProductCategories = async () => {
  //   setLoader(true)
  //   const response = await Network.get(Url.getAllCategories('product'))
  //   setLoader(false)
  //   if (!response.ok) return showErrorMessage(response.data.message)
  //   setProductCategories(response.data.categories)
  // }
  // const getServiceCategories = async () => {
  //   setLoader(true)
  //   const response = await Network.get(Url.getAllCategories('service'))
  //   setLoader(false)
  //   if (!response.ok) return showErrorMessage(response.data.message)
  //   setServiceCategories(response.data.categories)
  // }

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
    // getProductCategories()
    // getServiceCategories()
    getCustomerDashboard()
  }, [])

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
        <CardHeader title='Product Categories' />
        <CardContent>
          <div className='scroll-container'>
            {productCategories.map(category => (
              <Button>{category}</Button>
            ))}
          </div>

          <Grid container>
            {products?.map((product, i) => (
              <Grid xs={12} lg={6} item>
                <ProductCard key={product?.id} id={product?.id} product={product} deleteProduct={() => {}} shopId={1} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 5 }}>
        <CardHeader title='Service Categories' />
        <CardContent>
          <div className='scroll-container'>
            {serviceCategories.map(category => (
              <Button>{category}</Button>
            ))}
          </div>
          <Grid container>
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
