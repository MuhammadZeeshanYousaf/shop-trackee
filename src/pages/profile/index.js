import Grid from '@mui/material/Grid'
import UserProfileHeader from './UserProfileHeader'
import UserProfile from './UserProfile'
import { Network, Url } from '../../configs'
import { useEffect, useState } from 'react'
import { showErrorMessage } from 'src/components'

const Profile = () => {
  const [user, setUser] = useState(null)

  const getUserProfile = async () => {
    const response = await Network.get(Url.getUser)
    console.log({ response })
    if (!response.ok) return showErrorMessage(response.data.message)
    setUser(response.data.resource_owner)
  }

  useEffect(() => {
    getUserProfile()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader user={user} />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <UserProfile user={user} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Profile
