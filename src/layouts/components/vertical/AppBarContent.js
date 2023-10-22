// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { TextField, Button, Dialog, Grid, Typography, InputAdornment, FormLabel, Input, Divider } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import Link from 'next/link'

//Custom imports

import { useLoader, useCoordinates } from 'src/hooks'
import { Url, Network } from 'src/configs'
import { useRouter } from 'next/router'
import Webcam from 'react-webcam'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState, useRef, useCallback, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { showWarningMessage } from 'src/components'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const router = useRouter()
  const { setLoader } = useLoader()
  const { longitude, latitude } = useCoordinates()
  const webcamRef = useRef(null)
  const [searchValue, setSearchValue] = useState('')
  const theme = useTheme()
  const [distance, setDistance] = useState(0)
  const fileInputRef = useRef(null)

  const FACING_MODE_USER = 'user'
  const FACING_MODE_ENVIRONMENT = 'environment'
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER)
  const [openDialog, setOpenDialog] = useState(false)
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'))
  const user = JSON.parse(localStorage.getItem('userData'))

  const videoConstraints = {
    facingMode: FACING_MODE_USER
  }

  const LinkStyled = styled(Link)({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
  })

  const switchCamera = useCallback(() => {
    setFacingMode(prevState => (prevState === FACING_MODE_USER ? FACING_MODE_ENVIRONMENT : FACING_MODE_USER))
  }, [])

  const search = async text => {
    if (text == 'searchByImage') {
      setOpenDialog(false)
      const imageSrc = webcamRef.current.getScreenshot()
      localStorage.setItem('search-image', imageSrc)
      router.push(
        `/search-result?q=${encodeURIComponent(
          imageSrc
        )}&longitude=${longitude}&latitude=${latitude}&distance=${distance}&method=post`
      )
    } else if (text == 'searchByText') {
      setOpenDialog(false)
      router.push(
        `/search-result?q=${searchValue}&longitude=${longitude}&latitude=${latitude}&distance=${distance}&method=get`
      )
    }
  }

  const handleImage = () => {
    const file = fileInputRef.current?.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = e => {
        const base64String = e.target.result

        setOpenDialog(false)
        router.push(
          `/search-result?q=${encodeURIComponent(
            base64String
          )}&longitude=${longitude}&latitude=${latitude}&distance=${distance}&method=post`
        )
      }

      reader.readAsDataURL(file)
    } else {
      showWarningMessage('No file selected')
    }
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
            <Grid item lg={12} md={12} xs={12}>
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
            <Grid item sx={{ mt: 5 }} md={10} xs={8}>
              <TextField
                fullWidth
                placeholder='Search here'
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
            <Grid sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'end' }} item md={2} xs={4}>
              <Button size='large' variant='contained' onClick={() => search('searchByText')}>
                Search
              </Button>
            </Grid>

            <Grid sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'start' }} item md={2} xs={12}>
              <FormLabel>
                <b>Search Around: </b>
              </FormLabel>
              <TextField
                sx={{ width: '34%', ml: 1 }}
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
            </Grid>

            {/* Camera */}

            <Grid sx={{ display: 'flex', alignItems: 'center', mt: 5, flexDirection: 'column' }} item md={6} xs={12}>
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
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant='contained' size='small' onClick={() => search('searchByImage')}>
                  Capture & Search
                </Button>
                <Button sx={{ ml: 3 }} variant='outlined' size='small' onClick={switchCamera}>
                  <Icon icon='tabler:refresh' />
                </Button>
              </div>
            </Grid>

            <Grid xs={12}>
              <Divider
                sx={{
                  color: 'text.disabled',
                  '& .MuiDivider-wrapper': { px: 6 },
                  fontSize: theme.typography.body2.fontSize,
                  my: theme => `${theme.spacing(3.5)} !important`
                }}
              >
                or
              </Divider>
            </Grid>

            <Grid sx={{ textAlign: 'center', mt: 2 }} item md={6} xs={12}>
              {/* <Input type='file' sx={{ border: 'none', mb: 5 }} onChange={e => handleImage(e)} /> */}

              <div>
                <input type='file' ref={fileInputRef} />
                <Button variant='contained' size='medium' sx={{ mt: 6 }} onClick={handleImage}>
                  Search It
                </Button>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box
          className='actions-left'
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            textAlign: 'left',
            marginRight: 1
          }}
        >
          <LinkStyled href='/'>
            <img style={{ width: '40px', borderRight: 'black 1px' }} alt='logo' src={'/images/app-icon.svg'} />
          </LinkStyled>
          {/* {hidden ? (
            <IconButton color='inherit' sx={{ ml: -3.75 }} onClick={toggleNavVisibility}>
              <Icon fontSize='1.5rem' icon='tabler:menu-2' />
            </IconButton>
          ) : null} */}
        </Box>
        <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
          {user?.role == 'customer' ? <NotificationDropdown settings={settings} /> : null}
          <ModeToggler settings={settings} saveSettings={saveSettings} />
          {user?.role == 'customer' ? (
            <IconButton color='inherit' sx={{ ml: -1.75 }} onClick={() => setOpenDialog(true)}>
              <Icon fontSize='1.5rem' icon='tabler:search' />
            </IconButton>
          ) : null}
          <UserDropdown settings={settings} />
        </Box>
      </Box>
    </>
  )
}

export default AppBarContent
