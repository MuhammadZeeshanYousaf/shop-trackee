// ** React Imports
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import MuiAvatar from '@mui/material/Avatar'
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const UserProfileHeader = ({ user }) => {
  const router = useRouter()
  const theme = useTheme()

  const handleEditProfile = () => {
    if (user?.role == 'customer') {
      return router.push('/edit-user-profile')
    }
    router.push('/edit-profile')
  }

  return (
    <Card>
      <CardMedia
        component='img'
        alt='profile-header'
        image={'/images/pages/profile-banner.png'}
        sx={{
          height: { xs: 150, md: 250 }
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        {user?.avatar ? (
          <ProfilePicture src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${user?.avatar}`} alt='profile-picture' />
        ) : (
          <MuiAvatar variant='rounded' sx={{ width: 108, height: 108, bgcolor: theme.palette.secondary }}>
            {user?.name[0]?.toUpperCase()}
          </MuiAvatar>
        )}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'center',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 2.5 }}>
              {user?.name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='tabler:map-pin' />
                <Typography sx={{ color: 'text.secondary' }}>{user?.country}</Typography>
              </Box>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='tabler:crown' />
                <Typography sx={{ color: 'text.secondary' }}>{user?.role}</Typography>
              </Box>
            </Box>
          </Box>
          <Box minWidth={200} textAlign={'center'}>
            <Button variant='contained' sx={{ '& svg': { mr: 2 } }} onClick={() => handleEditProfile()}>
              Edit Profile
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader
