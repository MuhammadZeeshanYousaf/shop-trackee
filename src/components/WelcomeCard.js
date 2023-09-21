// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

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
  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h5' sx={{ mb: 0.5 }}>
          Welcome John 
        </Typography>
        <Typography sx={{ mb: 2, color: 'text.secondary' }}>to Shop Trackee</Typography>
        <Typography variant='h4' sx={{ mb: 0.75, color: 'primary.main' }}>
          
        </Typography>
        <Button sx={{mt:3}} variant='contained'>View Shops</Button>
        <Illustration width={116} alt='congratulations john' src='/images/congratulations-john.png' />
      </CardContent>
    </Card>
  )
}

export default WelcomeCard
