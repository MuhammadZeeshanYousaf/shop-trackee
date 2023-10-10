import { Grid, Typography, Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Network, Url, multipartConfig } from 'src/configs'
import { useLoader } from 'src/hooks'

import ServiceCard from '../shop/products-and-services/ServiceCard'
import Icon from 'src/@core/components/icon'
import { CustomerProductCard, showErrorMessage, showSuccessMessage } from 'src/components'
import ShopCard from '../shop/ShopCard'

const NoResults = ({ value }) => {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '100%' }}
    >
      <Box sx={{ mb: 2.5, color: 'text.primary' }}>
        <Icon icon='tabler:file-off' fontSize='5rem' />
      </Box>
      <Typography variant='h6' sx={{ mb: 11.5, wordWrap: 'break-word' }}>
        No Data for{' '}
        <Typography variant='h6' component='span' sx={{ wordWrap: 'break-word' }}>
          {`"${value}"`}
        </Typography>
      </Typography>
    </Box>
  )
}

const SearchResult = () => {
  const router = useRouter()
  const { q, distance, longitude, latitude, method } = router.query

  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [shops, setShops] = useState([])

  const { setLoader } = useLoader()
  const getData = async () => {
    setLoader(true)
    const response = await Network.get(Url.search(q, distance, longitude, latitude))
    setLoader(false)
    setProducts(response.data.products)
    setServices(response.data.services)
    setShops(response.data.shops)
  }

  const getImageSearchData = async () => {
    const payload = {
      q,
      distance,
      longitude,
      latitude
    }
    setLoader(true)
    const response = await Network.post(Url.searhWithImage, payload)
    setLoader(false)
    setProducts(response.data.products)
    setServices(response.data.services)
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
    if (method == 'get') getData()
    if (method == 'post') getImageSearchData()
  }

  useEffect(() => {
    if (method == 'get') getData()
    if (method == 'post') getImageSearchData()
  }, [])

  return (
    <div>
      <Typography sx={{ mt: 5 }} variant='h2'>
        Products
      </Typography>
      <Grid sx={{ mt: 5 }} container spacing={5}>
        {products.length > 0 ? (
          products?.map((product, i) => (
            <Grid item xs={12} sm={6} md={4}>
              <CustomerProductCard product={product} key={i} handleFavourite={addToFavourite} />
            </Grid>
          ))
        ) : (
          <NoResults value={'Products'} />
        )}
      </Grid>
      <Typography sx={{ mt: 5 }} variant='h2'>
        Services
      </Typography>

      <Grid sx={{ mt: 5 }} container spacing={5}>
        {services.length > 0 ? (
          services?.map((service, i) => (
            <Grid xs={12} lg={6} item>
              <ServiceCard
                service={service}
                key={i}
                handleFavourite={addToFavourite}
                deleteService={() => {}}
                shopId={1}
              />
            </Grid>
          ))
        ) : (
          <NoResults value={'Services'} />
        )}
      </Grid>

      <Typography sx={{ mt: 5 }} variant='h2'>
        Shops
      </Typography>
      <Grid container spacing={6} sx={{ marginTop: '5px' }}>
        {shops?.map(shop => {
          return <ShopCard key={shop.id} shop={shop} role='customer' deleteShop={() => {}} />
        })}
      </Grid>
    </div>
  )
}

SearchResult.acl = {
  subject: 'search-result',
  action: 'read'
}

export default SearchResult
