// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'
import appConfig from 'src/configs/appConfig'

const Illustration = styled('img')(({ theme }) => ({
  right: 20,
  bottom: 0,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    right: 5,
    width: 110
  }
}))

const WelcomeCard = () => {
  const user = JSON.parse(localStorage.getItem('userData'))
  const route = useRouter()

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h5' sx={{ mb: 0.5 }} color={'primary.dark'}>
          Welcome {user?.name}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>to {appConfig.appName}</Typography>

        <Typography variant='h4' sx={{ color: 'primary.main' }}>
          &nbsp;
        </Typography>
        <Button sx={{ mt: 2.5 }} variant='contained' onClick={() => route.push('/shop')}>
          View Shops
        </Button>
        <Illustration width={116} alt='congratulations john' src='/images/congratulations-john.png' />
      </CardContent>
    </Card>
  )
}

export default WelcomeCard
