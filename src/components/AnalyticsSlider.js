// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const data = [
  {
    title: 'Order History',
    img: '',
    details: {
      Searches: '268',
      Delivered: '890',
      Pending: '62',
      Rejected: '1.2k'
    }
  }
]

const Slides = ({ theme, stats }) => {
  const user = JSON.parse(localStorage.getItem('userData'))
 

  return (
    <Box className='keen-slider__slide' sx={{ p: 6, '& .MuiTypography-root': { color: 'common.white' } }}>
      <Typography variant='h5' sx={{ mb: 0.5 }}>
        Lets explore {user?.name}
      </Typography>
      <Typography variant='body2' sx={{ mb: 4.5 }}>
        to Shop Trackee
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={8} sx={{ order: [2, 1] }}>
          <Typography variant='h6' sx={{ mb: 4.5 }}>
            Order History
          </Typography>
          <Grid container spacing={4.5}>
            {Object?.keys(stats)?.map((key, index) => {
              return key != 'name' ? (
                <Grid item key={index} xs={6}>
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
                        backgroundColor: 'primary.dark'
                      }}
                    >
                      {stats[key]}
                    </CustomAvatar>
                    <Typography noWrap>{key?.toUpperCase()}</Typography>
                  </Box>
                </Grid>
              ) : null
            })}
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
  )
}

const AnalyticsSlider = ({ stats }) => {
  // ** States
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // ** Hook
  const theme = useTheme()

  // const [sliderRef, instanceRef] = useKeenSlider(
  //   {
  //     loop: false,
  //     initial: 0,
  //     rtl: theme.direction === 'rtl',
  //     slideChanged(slider) {
  //       setCurrentSlide(slider.track.details.rel)
  //     },
  //     created() {
  //       setLoaded(true)
  //     }
  //   },
  //   [
  //     slider => {
  //       let mouseOver = false
  //       let timeout

  //       const clearNextTimeout = () => {
  //         clearTimeout(timeout)
  //       }

  //       const nextTimeout = () => {
  //         clearTimeout(timeout)
  //         if (mouseOver) return
  //         timeout = setTimeout(() => {
  //           slider.next()
  //         }, 4000)
  //       }
  //       slider.on('created', () => {
  //         slider.container.addEventListener('mouseover', () => {
  //           mouseOver = true
  //           clearNextTimeout()
  //         })
  //         slider.container.addEventListener('mouseout', () => {
  //           mouseOver = false
  //           nextTimeout()
  //         })
  //         nextTimeout()
  //       })
  //       slider.on('dragStarted', clearNextTimeout)
  //       slider.on('animationEnded', nextTimeout)
  //       slider.on('updated', nextTimeout)
  //     }
  //   ]
  // )

  return (
    <Card sx={{ position: 'relative', backgroundColor: 'primary.main' }}>
      {/* {loaded && instanceRef.current && (
        <Box className='swiper-dots' sx={{ top: 4, right: 6, position: 'absolute' }}>
          <Badge
            variant='dot'
            component='div'
            sx={{
              mr: `${theme.spacing(3.5)} !important`,
              '& .MuiBadge-dot': {
                width: '8px !important',
                height: '8px !important',
                backgroundColor: `${hexToRGBA(theme.palette.common.white, 0.4)} !important`
              },
              '&.active .MuiBadge-dot': {
                backgroundColor: `${theme.palette.common.white} !important`
              }
            }}
          />
        </Box>
      )} */}
      <Box className='keen-slider'>{stats && <Slides theme={theme} stats={stats} />}</Box>
    </Card>
  )
}

export default AnalyticsSlider
