import { Grid, Button, Divider, Typography, Card, CardContent, Box, styled, CardActions } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { OrderRequestModal } from '../../../components'
import { useState } from 'react'

const StyledBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const ServiceCard = ({ service, deleteService, shopId, mode = 'customer' }) => {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)

  const handleEdit = () => {
    router.push(`/shop/products-and-services/EditService?shopId=${shopId}&serviceId=${service?.id}`)
  }
  return (
    <>
      <OrderRequestModal orderableType='service' orderableId={service?.id} open={open} handleClose={handleClose} />
      <Card sx={{ mt: 5, height: '300px' }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} sm={7}>
            <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
              <Typography variant='h5' sx={{ mb: 3.5 }}>
                {service?.name}
              </Typography>
              <Typography sx={{ color: 'text.secondary', height: '50px', overflow: 'hidden' }}>
                {service?.description}
              </Typography>
              <Divider
                sx={{
                  mt: theme => `${theme.spacing(6.5)} !important`,
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
                    <Typography sx={{ color: 'text.secondary' }}>Category: {service?.category_name}</Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75, mt: 1 } }}
                  >
                    <Icon icon='tabler:businessplan' fontSize={20} />
                    <Typography sx={{ color: 'text.secondary' }}>Charge by : {service?.charge_by}</Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75, mt: 1 } }}
                  >
                    <Icon icon='tabler:cash-banknote' fontSize={20} />
                    <Typography sx={{ color: 'text.secondary' }}>Rate : {service?.rate}</Typography>
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
            <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
              {mode == 'customer' ? (
                <Button size='small' variant='contained' onClick={() => setOpen(true)}>
                  Request Order
                </Button>
              ) : (
                <>
                  <Button size='small' sx={{ ml: 1 }} variant='contained' onClick={() => handleEdit()}>
                    Edit
                  </Button>
                  <Button size='small' variant='contained' onClick={() => deleteService(service?.id)}>
                    Delete
                  </Button>
                </>
              )}
            </CardActions>
          </Grid>
          <Grid item sm={5} md={6} xs={12}>
            <div style={{ height: '300px' }}>
              <img
                style={{ height: '100%', objectFit: 'contain', width: '100%' }}
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${service?.images[0]?.path}`}
              />
            </div>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export default ServiceCard
