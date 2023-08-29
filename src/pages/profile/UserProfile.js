import Grid from '@mui/material/Grid'
import AboutOverivew from './AboutOverview'

const UserProfile = ({ user }) => {
  const data = {
    contacts: [
      {
        icon: 'tabler:phone-call',
        property: 'Contact',
        value: user?.phone
      },
    ],
    about: [
      { property: 'Full Name', value: user?.name, icon: 'tabler:user' },

      { property: 'Role', value: user?.role, icon: 'tabler:crown' },

      { property: 'Country', value: user?.country, icon: 'tabler:flag' }
    ],
    overview: [
      {
        icon: 'tabler:check',
        property: 'Task Compiled',
        value: '13.5k'
      },
      {
        icon: 'tabler:users',
        property: 'Connections',
        value: '897'
      },
      {
        icon: 'tabler:layout-grid',
        property: 'Projects Compiled',
        value: '146'
      }
    ]
  }

  return (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverivew about={data.about} contacts={data.contacts}  overview={data.overview} />
      </Grid>
    </Grid>
  )
}

export default UserProfile
