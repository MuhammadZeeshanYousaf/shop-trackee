import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  Typography,
  Dialog,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { AnalyticsSlider, Map, showErrorMessage, CustomerProductCard, showSuccessMessage } from '../../components'
import { useLoader, useCoordinates } from 'src/hooks'
import { Network, Url } from 'src/configs'
import ServiceCard from '../shop/products-and-services/ServiceCard'
import ShopCard from '../shop/ShopCard'

import { useRouter } from 'next/router'

const CustomerDashboard = () => {
  const { setLoader } = useLoader()
  const { setCoordinates, latitude, longitude } = useCoordinates()
  const router = useRouter()

  const [productCategories, setProductCategories] = useState([])
  const [serviceCategories, setServiceCategories] = useState([])
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [shops, setShops] = useState([])
  const [stats, setStats] = useState(null)

  const distance = localStorage.getItem('distance')

  const getCustomerDashboard = async (longitude, latitude) => {
    setLoader(true)
    const response = await Network.get(Url.customeDashboard(localStorage.getItem('distance'), longitude, latitude))
    setLoader(false)

    setProductCategories(response.data.product.categories)
    setServiceCategories(response.data.service.categories)
    setProducts(response.data.product.data)
    setServices(response.data.service.data)
    setShops(response.data.shop.data)
    setStats(response.data.stats)
  }

  const addToFavourite = async (id, status, type) => {
    const payload = {
      favoritable_id: id,
      favoritable_type: type,
      is_favorite: status
    }
    setLoader(true)
    const response = await Network.put(Url.addToFavourite, payload)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    getCustomerDashboard(longitude, latitude)
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setLoader(true)
          setCoordinates(position?.coords?.longitude, position?.coords?.latitude)
          setLoader(false)
          getCustomerDashboard(position?.coords?.longitude, position?.coords?.latitude)
        },
        error => {
          getCustomerDashboard('', '')
        }
      ),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
    } else {
      showErrorMessage('It is better to select location')
    }
  }, [])

  const search = async text => {
    router.push(`/search-result?q=${text}&longitude=${longitude}&latitude=${latitude}&distance=${distance}&method=get`)
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <AnalyticsSlider stats={stats} />
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InputLabel sx={{ mr: 1 }}>Explore By</InputLabel>
            <FormControl>
              <InputLabel sx={{ mr: 1 }} id='demo-simple-select-label'>
                Category
              </InputLabel>
              <Select
                label='Category'
                defaultValue=''
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                onChange={e => search(e.target.value)}
              >
                <MenuItem value=''>Category</MenuItem>
                {productCategories.map(category => (
                  <MenuItem value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              size='large'
              onClick={() =>
                router.push(
                  `/fetch-products?longitude=${longitude}&latitude=${latitude}&distance=${distance}&product_page=1`
                )
              }
            >
              View All
            </Button>
          </div>
        </div>

        <CardContent>
          <Grid container spacing={5}>
            {products?.map((product, i) => (
              <Grid item xs={12} sm={6} md={4}>
                <CustomerProductCard product={product} key={i} handleFavourite={addToFavourite} />
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

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InputLabel sx={{ mr: 1 }}>Explore By</InputLabel>

            <FormControl>
              <InputLabel sx={{ mr: 1 }} id='demo-simple-select-label'>
                Category
              </InputLabel>
              <Select
                labelId='demo-simple-select-label'
                label='Category'
                defaultValue=''
                onChange={e => search(e.target.value)}
              >
                <MenuItem value=''>Category</MenuItem>
                {serviceCategories.map(category => (
                  <MenuItem value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
        </div>
        <CardContent>
          <Grid container spacing={5}>
            {services?.map((service, i) => (
              <Grid xs={12} lg={6} item>
                <ServiceCard
                  handleFavourite={addToFavourite}
                  service={service}
                  key={i}
                  deleteService={() => {}}
                  shopId={1}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 5 }}>
        <Typography sx={{ pt: 5, pl: 5 }} variant='h4'>
          Shops
        </Typography>
        <CardContent>
          <Grid container spacing={6} sx={{ marginTop: '5px' }}>
            {shops?.map(shop => {
              return <ShopCard key={shop.id} shop={shop} role='customer' deleteShop={() => {}} />
            })}
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
