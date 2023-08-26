import Grid from '@mui/material/Grid'
import UserProfileHeader from './UserProfileHeader'
import UserProfile from './UserProfile'

const Profile = () => {
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
