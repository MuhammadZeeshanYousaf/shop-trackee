import Grid from '@mui/material/Grid'
import AboutOverivew from './AboutOverview'

const UserProfile = () => {
  const data = {
    contacts: [
      {
        icon: 'tabler:phone-call',
        property: 'Contact',
        value: '(123) 456-7890'
      },
      {
        icon: 'tabler:brand-skype',
        property: 'Skype',
        value: 'john.doe'
      },
      {
        icon: 'tabler:mail',
        property: 'Email',
        value: 'john.doe@example.com'
      }
    ],
    about: [
      { property: 'Full Name', value: 'John Doe', icon: 'tabler:user' },

      { property: 'Status', value: 'active', icon: 'tabler:check' },

      { property: 'Role', value: 'Developer', icon: 'tabler:crown' },

      { property: 'Country', value: 'USA', icon: 'tabler:flag' }
    ],
    teams: [
      {
        color: 'primary',
        icon: 'tabler:brand-github',
        property: 'Backend Developer',
        value: '(126 Members)'
      }
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
        <AboutOverivew about={data.about} contacts={data.contacts} teams={data.teams} overview={data.overview} />
      </Grid>
    </Grid>
  )
}

export default UserProfile
