import Grid from '@mui/material/Grid'
import UserProfileHeader from './UserProfileHeader'
import UserProfile from './UserProfile'
import { Network, Url } from '../../configs'
import { useEffect, useState } from 'react'
import { showErrorMessage } from 'src/components'
import { useLoader } from 'src/hooks'

const Profile = () => {
  const [user, setUser] = useState(null)
  const { setLoader } = useLoader()

  const getUserProfile = async () => {
    setLoader(true)
    const response = await Network.get(Url.getUser)
    setLoader(false)
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

Profile.acl = {
  subject: 'profile',
  action: 'read'
}

export default Profile
