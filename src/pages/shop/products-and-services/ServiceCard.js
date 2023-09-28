import { Grid, Button, Divider, Typography, Card, CardContent, Box, styled, CardActions } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

const StyledBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const ServiceCard = ({ service, deleteService, shopId }) => {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/shop/products-and-services/EditService?shopId=${shopId}&serviceId=${service?.id}`)
  }
  return (
    <Card sx={{ mt: 5 }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} sm={7}>
          <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
            <Typography variant='h5' sx={{ mb: 3.5 }}>
              {service?.name}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>{service?.description}</Typography>
            <Divider
              sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: theme => `${theme.spacing(6.75)} !important` }}
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
            <Button sx={{ ml: 1 }} variant='contained' onClick={() => handleEdit()}>
              Edit
            </Button>
            <Button variant='contained' onClick={() => deleteService(service?.id)}>
              Delete
            </Button>
          </CardActions>
        </Grid>
        <Grid item sm={5} md={7} xs={12}>
          <img
            style={{ minHeight: '100%', objectFit: 'contain', width: '100%' }}
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${service?.images[0]?.path}`}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default ServiceCard
