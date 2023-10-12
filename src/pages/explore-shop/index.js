import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useLoader } from 'src/hooks'
import { Network, Url } from 'src/configs'
import { showErrorMessage, showSuccessMessage, CustomerProductCard } from 'src/components'
import { Typography, Grid, Box } from '@mui/material'
import ServiceCard from '../shop/products-and-services/ServiceCard'

import Icon from 'src/@core/components/icon'

const ExploreShop = () => {
  const { query } = useRouter()
  const { setLoader } = useLoader()
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])

  const NoResults = ({ value }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%'
        }}
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

  const searchByShop = async () => {
    setLoader(true)
    const response = await Network.get(Url.searchByShop(query?.shopId, 1, 1))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)

    setProducts(response.data.product.data)
    setServices(response.data.service.data)
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
    searchByShop()
  }

  useEffect(() => {
    searchByShop()
  }, [])

  return (
    <div>
      <Typography sx={{ mt: 5 }} variant='h1'>
        {query?.name}
      </Typography>
      <Typography sx={{ mt: 5 }} variant='h2'>
        Products
      </Typography>
      <Grid sx={{ mt: 5 }} container spacing={5}>
        {products?.length > 0 ? (
          products?.map((product, i) => {
            return (
              <Grid item xs={12} sm={6} md={4}>
                <CustomerProductCard product={product} key={i} handleFavourite={addToFavourite} />
              </Grid>
            )
          })
        ) : (
          <NoResults value={'Products'} />
        )}
      </Grid>
      <Typography sx={{ mt: 5 }} variant='h2'>
        Services
      </Typography>

      <Grid sx={{ mt: 5 }} container spacing={5}>
        {services?.length > 0 ? (
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
    </div>
  )
}

ExploreShop.acl = {
  subject: 'explore-shop',
  action: 'read'
}

export default ExploreShop
