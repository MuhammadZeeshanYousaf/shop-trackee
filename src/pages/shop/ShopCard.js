import { Grid, Card, CardContent, Box, Button, Typography, Avatar } from '@mui/material'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import moment from 'moment'
import { useRouter } from 'next/router'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useCoordinates } from 'src/hooks'
import { useState } from 'react'
import { MapModal } from 'src/components'

const ShopCard = ({ shop, deleteShop, role = 'Admin' }) => {
  const router = useRouter()
  const { longitude, latitude } = useCoordinates()
  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)

  const origin = {
    longitude,
    latitude
  }

  const destination = {
    longitude: shop?.longitude,
    latitude: shop?.latitude
  }

  return (
    <>
      <MapModal key={open} open={open} handleClose={handleClose} destination={destination} origin={origin} />
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ position: 'relative', minHeight: '100%' }}>
          {role == 'Admin' ? (
            <OptionsMenu
              iconButtonProps={{
                size: 'small',
                sx: { top: 12, right: 12, position: 'absolute', color: 'text.disabled' }
              }}
              options={[
                { text: 'Edit', menuItemProps: { onClick: () => router.push(`/shop/form?mode=Edit&id=${shop.id}`) } },
                { divider: true },
                { text: 'Delete', menuItemProps: { sx: { color: 'error.main' }, onClick: () => deleteShop(shop?.id) } }
              ]}
            />
          ) : null}
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CustomAvatar src={'/images/shop-icon.svg'} sx={{ p: 5, width: '6rem', height: '6rem' }} />
              <Typography variant='h4'>{shop?.name}</Typography>
              <Typography sx={{ mb: 5, color: 'text.secondary', fontWeight: 500 }}>{shop?.contact}</Typography>
              <Box sx={{ mb: 5 }}>
                <Typography
                  sx={{ mb: 5, color: 'text.secondary', fontWeight: 500, height: '50px', overflow: 'hidden' }}
                >
                  {shop?.description}
                </Typography>
              </Box>
              <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
                {shop?.opening_time ? (
                  <CustomChip
                    sx={{ mr: 2.5 }}
                    rounded
                    size='small'
                    skin='light'
                    color='info'
                    label={moment(shop?.opening_time).format('h:mm A')}
                  />
                ) : null}
                {shop?.closing_time ? (
                  <CustomChip
                    sx={{ mr: 2.5 }}
                    rounded
                    size='small'
                    skin='light'
                    color='warning'
                    label={moment(shop?.closing_time).format('h:mm A')}
                  />
                ) : null}
              </Box>

              <Box
                sx={{
                  mb: 5,
                  gap: 2,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-around'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <Typography variant='h4'>{shop?.products_count}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Products</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <Typography variant='h4'>{shop?.services_count}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Services</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <Typography variant='h4'>{shop?.order_requests_count}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Requests</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <Typography variant='h4'>{shop?.orders_count}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Orders</Typography>
                </Box>
              </Box>

              {role == 'Admin' ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    sx={{ mr: 4, '& svg': { mr: 2 } }}
                    variant={true ? 'contained' : 'tonal'}
                    onClick={() => router.push(`/shop/products-and-services?shopId=${shop?.id}`)}
                  >
                    Show
                  </Button>
                  <Button variant='tonal' color='secondary' sx={{ p: 2, minWidth: 38 }}>
                    <Icon icon='tabler:bell-dollar' />
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    sx={{ mr: 4, '& svg': { mr: 2 } }}
                    variant={true ? 'contained' : 'tonal'}
                    onClick={() => setOpen(true)}
                  >
                    Get Directions
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default ShopCard
