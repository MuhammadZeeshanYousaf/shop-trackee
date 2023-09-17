import { Grid, Button, Divider, Typography, Card, CardContent, Box, styled } from '@mui/material'
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
    router.push(`/products-and-services/EditService?shopId=${shopId}&serviceId=${service?.id}`)
  }
  return (
    <Card sx={{ mt: 5 }}>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={7}>
          <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
            <Typography variant='h5' sx={{ mb: 3.5 }}>
              {service?.name}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>{service?.description}</Typography>
            <Divider
              sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: theme => `${theme.spacing(6.75)} !important` }}
            />
            <Grid container spacing={4}>
              <Grid item xs={12} sm={5}>
                <StyledBox>
                  <Box
                    sx={{
                      mb: 6.75,
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': { color: 'primary.main', mr: 2.75 }
                    }}
                  >
                    <Icon icon='tabler:lock-open' fontSize={20} />
                    <Typography sx={{ color: 'text.secondary' }}>Full Access</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.75 } }}>
                    <Icon icon='tabler:user' fontSize={20} />
                    <Typography sx={{ color: 'text.secondary' }}>15 Members</Typography>
                  </Box>
                </StyledBox>
              </Grid>
              <Grid item xs={12} sm={7}>
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
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
        <Grid
          item
          sm={5}
          xs={12}
          sx={{ pt: ['0 !important', '1.5rem !important'], pl: ['1.5rem !important', '0 !important'] }}
        >
          <CardContent
            sx={{
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'action.hover',
              p: theme => `${theme.spacing(18, 5, 16)} !important`
            }}
          >
            <div>
              <Box sx={{ mb: 3.5, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Typography variant='h6'>Rs</Typography>
                <Typography variant='h6' sx={{ lineHeight: 1, fontWeight: 600, fontSize: '3.75rem !important' }}>
                  {service?.rate}
                </Typography>
                <Typography variant='h6'>PKR</Typography>
              </Box>
              <Typography sx={{ mb: 13.75, display: 'flex', color: 'text.secondary', flexDirection: 'column' }}>
                <span>5 Tips For Offshore</span>
                <span>Software Development</span>
              </Typography>
              <Box>
                <Button variant='contained' onClick={() => deleteService(service?.id)}>
                  Delete
                </Button>
                <Button sx={{ ml: 1 }} variant='contained' onClick={() => handleEdit()}>
                  Edit
                </Button>
              </Box>
            </div>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default ServiceCard
