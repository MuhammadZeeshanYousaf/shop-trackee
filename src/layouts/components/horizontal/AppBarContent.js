// ** MUI Imports
import Box from '@mui/material/Box'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import Icon from 'src/@core/components/icon'
import {
  Dialog,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  Grid,
  Button,
  FormLabel,
  Input
} from '@mui/material'
import { useState, useRef, useCallback, useEffect } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import MuiAutocomplete from '@mui/material/Autocomplete'
import Webcam from 'react-webcam'
import { useRouter } from 'next/router'
import { useCoordinates, useLoader } from 'src/hooks'
import { Network, Url } from 'src/configs'
import { showErrorMessage } from 'src/components'

const notifications = [
  {
    meta: 'Today',
    avatarAlt: 'Flora',
    title: 'Congratulation Flora! 🎉',
    avatarImg: '/images/avatars/4.png',
    subtitle: 'Won the monthly best seller badge'
  },
  {
    meta: 'Yesterday',
    avatarColor: 'primary',
    subtitle: '5 hours ago',
    avatarText: 'Robert Austin',
    title: 'New user registered.'
  },
  {
    meta: '11 Aug',
    avatarAlt: 'message',
    title: 'New message received 👋🏻',
    avatarImg: '/images/avatars/5.png',
    subtitle: 'You have 10 unread messages'
  },
  {
    meta: '25 May',
    title: 'Paypal',
    avatarAlt: 'paypal',
    subtitle: 'Received Payment',
    avatarImg: '/images/misc/paypal.png'
  },
  {
    meta: '19 Mar',
    avatarAlt: 'order',
    title: 'Received Order 📦',
    avatarImg: '/images/avatars/3.png',
    subtitle: 'New order received from John'
  },
  {
    meta: '27 Dec',
    avatarAlt: 'chart',
    subtitle: '25 hrs ago',
    avatarImg: '/images/misc/chart.png',
    title: 'Finance report has been generated'
  }
]

const AppBarContent = props => {
  // ** Props
  const theme = useTheme()
  const router = useRouter()
  const { setLoader } = useLoader()
  const { longitude, latitude } = useCoordinates()
  const { settings, saveSettings } = props
  const user = JSON.parse(localStorage.getItem('userData'))
  const [openDialog, setOpenDialog] = useState(false)
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'))
  const webcamRef = useRef(null)
  const [searchValue, setSearchValue] = useState('')
  const [distance, setDistance] = useState(0)

  const FACING_MODE_USER = 'user'
  const FACING_MODE_ENVIRONMENT = 'environment'
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER)

  const videoConstraints = {
    facingMode: FACING_MODE_USER
  }
  const switchCamera = useCallback(() => {
    setFacingMode(prevState => (prevState === FACING_MODE_USER ? FACING_MODE_ENVIRONMENT : FACING_MODE_USER))
  }, [])

  // const capture = useCallback(() => {
  //   const imageSrc = webcamRef.current.getScreenshot()
  //   setImageSrc(imageSrc)
  // }, [webcamRef])

  const search = async text => {
    if (text == 'searchByImage') {
      setOpenDialog(false)
      const imageSrc = webcamRef.current.getScreenshot()
      localStorage.setItem('search-image', imageSrc)
      router.push(
        `/search-result?q=${encodeURIComponent(imageSrc)}&longitude=${longitude}&latitude=${latitude}&distance=${distance}&method=post`
      )
    } else if (text == 'searchByText') {
      setOpenDialog(false)
      router.push(
        `/search-result?q=${searchValue}&longitude=${longitude}&latitude=${latitude}&distance=${distance}&method=get`
      )
    }
  }

  const handleImage = event => {
    const file = event.target.files[0]

    const reader = new FileReader()

    reader.onload = e => {
      const base64String = e.target.result
      router.push(
        `/search-result?q=${encodeURIComponent(base64String)}&longitude=${longitude}&latitude=${latitude}&distance=${distance}&method=post`
      )
    }

    reader.readAsDataURL(file)
  }

  useEffect(() => {
    setDistance(localStorage.getItem('distance'))
  }, [])

  return (
    <>
      <Dialog
        fullWidth
        open={openDialog}
        fullScreen={fullScreenDialog}
        sx={{ p: 5 }}
        onClose={() => setOpenDialog(false)}
      >
        <Box sx={{ top: 0, width: '100%' }}>
          <Grid container sx={{ p: 5 }}>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant='h4'>Search Box</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'end' }}>
                  <IconButton size='small' sx={{ p: 1 }} onClick={() => setOpenDialog(false)}>
                    <Icon icon='tabler:x' fontSize='1.25rem' />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid sx={{ mt: 5 }} item xs={10}>
              <TextField
                fullWidth
                placeholder='Search Here'
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start' sx={{ color: 'text.primary' }}>
                      <Icon fontSize='1.5rem' icon='tabler:search' />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position='end'
                      onClick={() => console.log('empty')}
                      sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                    ></InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'end' }} item xs={2}>
              <Button size='small' variant='contained' onClick={() => search('searchByText')}>
                Search
              </Button>
            </Grid>

            <Grid
              sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
              item
              xs={6}
            >
              <Input type='file' sx={{ border: 'none', mb: 5 }} onChange={e => handleImage(e)} />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FormLabel>
                  <b>Search Around:</b>{' '}
                </FormLabel>
                <TextField
                  sx={{ width: '100px', ml: 1 }}
                  type='number'
                  value={distance}
                  placeholder='Distance'
                  onChange={event => {
                    if (event.target.value < 0) {
                      setDistance(0)
                      localStorage.setItem('distance', 0)
                      return
                    }
                    setDistance(event.target.value)
                    localStorage.setItem('distance', event.target.value)
                  }}
                />
                <FormLabel sx={{ ml: 1 }}>KM</FormLabel>
              </div>
            </Grid>

            {/* Camera */}

            <Grid sx={{ textAlign: 'center' }} item xs={6}>
              <Webcam
                height={'100%'}
                width={'100%'}
                audio={false}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                videoConstraints={{
                  ...videoConstraints,
                  facingMode
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button sx={{ mr: 2 }} variant='contained' size='small' onClick={() => search('searchByImage')}>
                  Capture & Search
                </Button>
                <Button variant='outlined' size='small' onClick={switchCamera}>
                  <Icon icon='tabler:refresh' />
                </Button>
              </div>
            </Grid>
            {/* <Grid item xs={6} sx={{ textAlign: 'end', mt: 5 }}>

            </Grid>  */}
          </Grid>
        </Box>
      </Dialog>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {user.role == 'customer' ? (
          <Icon fontSize='1.5rem' icon='tabler:search' onClick={() => setOpenDialog(true)} />
        ) : null}
        {user?.role == 'customer' ? <NotificationDropdown settings={settings} /> : null}
        <UserDropdown settings={settings} />
      </Box>
    </>
  )
}

export default AppBarContent
