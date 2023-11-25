import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useLoader } from 'src/hooks'
import { Network, Url } from 'src/configs'
import moment from 'moment'
import CustomChip from 'src/@core/components/mui/chip'
import { showErrorMessage, showSuccessMessage, CustomerProductCard } from 'src/components'
import { Typography, Grid, Box, Pagination, Card, CardContent } from '@mui/material'
import ServiceCard from '../shop/products-and-services/ServiceCard'

import Icon from 'src/@core/components/icon'

const ExploreShop = () => {
  const { query } = useRouter()
  const { setLoader } = useLoader()
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])

  const [totalProductPages, setTotalProductPages] = useState(1)

  const [totalServicesPage, setTotalServicesPage] = useState(1)

  const [currentProductPage, setCurrentProductPage] = useState(1)

  const [currentServicePage, setCurrentServicePage] = useState(1)

  const [shop, setShop] = useState({})

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
    const response = await Network.get(Url.searchByShop(query?.shopId, currentProductPage, currentServicePage))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)

    setProducts(response.data.product.data)
    setTotalProductPages(response.data.product.total_pages)
    setServices(response.data.service.data)
    setTotalServicesPage(response.data.service.total_pages)
    setShop(response.data.shop.data)
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

  const isEmpty = value => {
    return value === undefined || value === 0 || value === null || value == '' || value?.length <= 0
  }

  const handleProductPage = (event, value) => {
    setCurrentProductPage(value)
  }

  const handleServicePage = (event, value) => {
    setCurrentServicePage(value)
  }

  useEffect(() => {
    searchByShop()
  }, [currentProductPage, currentServicePage])

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant='h2' component='div'>
            {shop.name}
          </Typography>
          {!isEmpty(shop.description) ? <Typography>{shop.description}</Typography> : null}
          <br />
          <Typography color='textSecondary'>
            <b>Contact:</b> {isEmpty(shop.contact) ? 'N/A' : shop.contact}
          </Typography>

          <Typography color='textSecondary'>
            <b>Address:</b> {isEmpty(shop.address?.label) ? 'N/A' : shop.address?.label}
          </Typography>

          <Typography color='textSecondary'>
            <b>Opening Time:</b>
            {'  '}
            {isEmpty(shop.opening_time) ? (
              'N/A'
            ) : (
              <CustomChip
                sx={{ mr: 2 }}
                rounded
                size='small'
                skin='light'
                color='info'
                label={moment(shop?.opening_time).format('h:mm A')}
              />
            )}{' '}
            <b>Closing Time:</b>{' '}
            {isEmpty(shop.closing_time) ? (
              'N/A'
            ) : (
              <CustomChip
                sx={{ mr: 2 }}
                rounded
                size='small'
                skin='light'
                color='warning'
                label={moment(shop?.closing_time).format('h:mm A')}
              />
            )}
          </Typography>

          <Typography color='textSecondary'>
            <b>Closing Days:</b> {isEmpty(shop.closing_days) ? 'N/A' : shop.closing_days.map(day => `${day}, `)}
          </Typography>

          <Typography color='textSecondary'>
            <b>Website:</b> {isEmpty(shop.shop_website_url) ? 'N/A' : shop.shop_website_url}
          </Typography>

          <Typography color='textSecondary'>
            <b>Social Links:</b> {isEmpty(shop.social_links) ? 'N/A' : shop.social_links.map(day => `${day}, `)}
          </Typography>
        </CardContent>
      </Card>

      <Typography sx={{ mt: 5 }} variant='h4'>
        Products
      </Typography>
      <Grid sx={{ mt: 5 }} container spacing={5}>
        {products?.length > 0 ? (
          products?.map((product, i) => {
            return (
              <Grid key={i} item xs={12} sm={6} md={4}>
                <CustomerProductCard product={product} key={i} handleFavourite={addToFavourite} />
              </Grid>
            )
          })
        ) : (
          <NoResults value={'Products'} />
        )}
      </Grid>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Pagination count={totalProductPages} onChange={handleProductPage} />
      </div>

      <Typography sx={{ mt: 5 }} variant='h4'>
        Services
      </Typography>

      <Grid sx={{ mt: 5 }} container spacing={5}>
        {services?.length > 0 ? (
          services?.map((service, i) => (
            <Grid key={i} xs={12} lg={6} item>
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

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Pagination count={totalServicesPage} onChange={handleServicePage} />
      </div>
    </div>
  )
}

ExploreShop.acl = {
  subject: 'explore-shop',
  action: 'read'
}

export default ExploreShop
