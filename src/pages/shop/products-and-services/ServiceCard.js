import {
  Grid,
  Button,
  Divider,
  Typography,
  Card,
  CardContent,
  Box,
  styled,
  CardActions,
  IconButton
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { OrderRequestModal } from '../../../components'
import { useState } from 'react'

const StyledBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const ServiceCard = ({ service, deleteService, shopId, mode = 'customer', handleFavourite = () => {} }) => {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)

  const handleEdit = () => {
    router.push(`/shop/products-and-services/EditService?shopId=${shopId}&serviceId=${service?.id}`)
  }

  return (
    <>
      <OrderRequestModal orderableType='service' orderableId={service?.id} open={open} handleClose={handleClose} />
      <Card sx={{ mt: 5 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} sm={5}>
            <div style={{ height: '300px' }}>
              <img
                style={{ height: '100%', objectFit: 'contain', width: '100%' }}
                alt='Service image'
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${service?.images[0]?.path}`}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6} sm={7}>
            <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h5' sx={{ mb: 3.5 }}>
                  {service?.name}
                </Typography>
                {mode == 'customer' ? (
                  service?.is_favorite ? (
                    <IconButton size='small' onClick={() => handleFavourite(service?.id, false, 'service')}>
                      <Icon fontSize='1.5rem' icon='tabler:heart-filled' color='red' />
                    </IconButton>
                  ) : (
                    <IconButton size='small' onClick={() => handleFavourite(service?.id, true, 'service')}>
                      <Icon fontSize='1.5rem' icon='tabler:heart' />
                    </IconButton>
                  )
                ) : null}
              </div>

              <Typography
                sx={{
                  color: 'text.secondary',
                  height: '79px',
                  overflow: 'auto',
                  msOverflowStyle: 'none',
                  '&::-webkit-scrollbar': {
                    width: '0'
                  }
                }}
              >
                {service?.description}
              </Typography>
              <Divider
                sx={{
                  mt: theme => `${theme.spacing(0.5)} !important`,
                  mb: theme => `${theme.spacing(6.75)} !important`
                }}
              />
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <Box
                    sx={{
                      mt: 1,
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': { color: 'primary.main', mr: 2.75 }
                    }}
                  >
                    <Icon icon='tabler:category' fontSize={20} />
                    <Typography sx={{ color: 'text.secondary' }}>
                      <b>Category:</b> {service?.category_name}
                    </Typography>
                  </Box>
                  {/* <Box
                    sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75, mt: 1 } }}
                  >
                    <Icon icon='tabler:businessplan' fontSize={20} />
                    <Typography sx={{ color: 'text.secondary' }}>
                      <b>Charge by:</b> {service?.charge_by}
                    </Typography>
                  </Box> */}
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75, mt: 1 } }}
                  >
                    <Icon icon='tabler:cash-banknote' fontSize={20} />
                    <Typography sx={{ color: 'text.secondary' }}>
                      <b>Rate:</b> {service?.rate} /{service?.charge_by}
                    </Typography>
                  </Box>
                </Grid>
                {/* <Grid item xs={12} sm={7}>
                <Box
                  sx={{ mb: 6.75, display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75 } }}
                >
                  <Icon icon='tabler:star' fontSize={20} />
                  <Typography sx={{ color: 'text.secondary' }}>Access all Features</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75 } }}>
                  <Icon icon='tabler:trending-up' fontSize={20} />
                  <Typography sx={{ color: 'text.secondary' }}>Lifetime Free Update</Typography>
                </Box>
              </Grid> */}
              </Grid>
            </CardContent>
            <CardActions>
              {mode == 'customer' ? (
                <Button size='medium' variant='contained' onClick={() => setOpen(true)}>
                  Request Service
                </Button>
              ) : (
                <>
                  <Button size='small' sx={{ ml: 1 }} variant='contained' onClick={() => handleEdit()}>
                    Edit
                  </Button>
                  <Button size='small' variant='tonal' onClick={() => deleteService(service?.id)}>
                    Delete
                  </Button>
                </>
              )}
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export default ServiceCard
