// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import appConfig from 'src/configs/appConfig'

const AnalyticsSlider = ({ stats }) => {
  const user = JSON.parse(localStorage.getItem('userData'))
  const theme = useTheme()

  return (
    <Card sx={{ position: 'relative', backgroundColor: '' }}>
      <Box className='keen-slider'>
        <Box className='keen-slider__slide' sx={{ p: 6, '& .MuiTypography-root': { color: '' } }}>
          <Typography variant='h5' sx={{ mb: 0.5 }} color={'primary.dark'}>
            Lets explore {user?.name}
          </Typography>
          <Typography variant='body2' sx={{ mb: 4.5 }}>
            in {appConfig.appName}
          </Typography>
          <Grid container>
            <Grid item xs={12} sm={8} sx={{ order: [2, 1] }}>
              <Typography variant='h6' sx={{ mb: 4.5 }}>
                Order History
              </Typography>
              <Grid container spacing={4.5}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontWeight: 500,
                        color: 'common.white',
                        backgroundColor: 'primary.main'
                      }}
                    >
                      {stats?.delivered}
                    </CustomAvatar>
                    <Typography noWrap>Delivered</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontWeight: 500,
                        color: 'common.white',
                        backgroundColor: 'primary.main'
                      }}
                    >
                      {stats?.pending}
                    </CustomAvatar>
                    <Typography noWrap>Pending</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontWeight: 500,
                        color: 'common.white',
                        backgroundColor: 'primary.main'
                      }}
                    >
                      {stats?.searches}
                    </CustomAvatar>
                    <Typography noWrap>Searches</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar
                      color='primary'
                      variant='rounded'
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 30,
                        fontWeight: 500,
                        color: 'common.white',
                        backgroundColor: 'primary.main'
                      }}
                    >
                      {stats?.rejected}
                    </CustomAvatar>
                    <Typography noWrap>Rejected</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{
                order: [1, 2],
                textAlign: 'center',
                '& img': {
                  height: '160px !important',
                  maxWidth: 'none !important',
                  [theme.breakpoints.up('sm')]: {
                    top: '50%',
                    position: 'absolute',
                    right: theme.spacing(6),
                    transform: 'translateY(-50%)'
                  }
                }
              }}
            >
              <img src={'/images/graphic-illustration-2.png'} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  )
}

export default AnalyticsSlider
