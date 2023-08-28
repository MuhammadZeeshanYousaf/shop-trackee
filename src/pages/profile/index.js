import Grid from '@mui/material/Grid'
import UserProfileHeader from './UserProfileHeader'
import UserProfile from './UserProfile'
import { Network, Url } from '../../configs'
import { useEffect } from 'react'

const Profile = () => {
  const getUserProfile = async () => {
    const response = await Network.get(Url.getUser)
    console.log({ response })
  }

  useEffect(() => {
    getUserProfile() 
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <UserProfile />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Profile
