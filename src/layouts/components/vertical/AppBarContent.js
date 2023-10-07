// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { TextField, Button, Dialog, Grid, Typography, InputAdornment, FormLabel } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

//Custom imports

import { useLoader, useCoordinates } from 'src/hooks'
import { Url, Network } from 'src/configs'
import { useRouter } from 'next/router'
import Webcam from 'react-webcam'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState, useRef, useCallback } from 'react'
import { styled, useTheme } from '@mui/material/styles'

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const router = useRouter()
  const { setLoader } = useLoader()
  const { longitude, latitude } = useCoordinates()
  const webcamRef = useRef(null)
  const [searchValue, setSearchValue] = useState('')
  const theme = useTheme()

  const FACING_MODE_USER = 'user'
  const FACING_MODE_ENVIRONMENT = 'environment'
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER)
  const [openDialog, setOpenDialog] = useState(false)
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'))
  const videoConstraints = {
    facingMode: FACING_MODE_USER
  }
  const switchCamera = useCallback(() => {
    setFacingMode(prevState => (prevState === FACING_MODE_USER ? FACING_MODE_ENVIRONMENT : FACING_MODE_USER))
  }, [])

  const search = async text => {
    if (text == 'searchByImage') {
      setOpenDialog(false)
      const imageSrc = webcamRef.current.getScreenshot()
      localStorage.setItem('search-image', imageSrc)
      router.push(`/search-result?q=${imageSrc}&longitude=${longitude}&latitude=${latitude}&distance=9720&method=post`)
    } else if (text == 'searchByText') {
      setOpenDialog(false)
      router.push(
        `/search-result?q=${searchValue}&longitude=${longitude}&latitude=${latitude}&distance=9720&method=get`
      )
    }
  }

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
            <Grid item sx={{ mt: 5 }} md={10} xs={12}>
              <TextField
                fullWidth
                placeholder='Search Here'
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                inputRef={input => {
                  if (input) {
                    if (openDialog) {
                      input.focus()
                    } else {
                      input.blur()
                    }
                  }
                }}
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
            <Grid sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'end' }} item md={2} xs={12}>
              <Button size='small' variant='contained' onClick={() => search('searchByText')}>
                Search
              </Button>
            </Grid>

            <Grid sx={{ display: 'flex', alignItems: 'center', mt: 10 }} item md={6} xs={12}>
              <FormLabel>Search Around</FormLabel>
              <TextField
                sx={{ width: '110px', ml: 1 }}
                type='number'
                placeholder='Distance'
                onChange={event => console.log({ event })}
              />
              <FormLabel sx={{ ml: 1 }}>km</FormLabel>
            </Grid>

            {/* Camera */}

            <Grid sx={{ textAlign: 'center' }} item md={6} xs={12}>
              <Webcam
                height={200}
                width={200}
                audio={false}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                videoConstraints={{
                  ...videoConstraints,
                  facingMode
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant='contained' size='small' onClick={switchCamera}>
                  Switch Camera
                </Button>
                <Button sx={{ ml: 1 }} variant='contained' size='small' onClick={() => search('searchByImage')}>
                  Capture & Search
                </Button>
              </div>
            </Grid>
            {/* <Grid item xs={6} sx={{ textAlign: 'end', mt: 5 }}>
             
            </Grid>  */}
          </Grid>
        </Box>
      </Dialog>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          {hidden ? (
            <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
              <Icon fontSize='1.5rem' icon='tabler:menu-2' />
            </IconButton>
          ) : null}

          <ModeToggler settings={settings} saveSettings={saveSettings} />
          <Icon fontSize='1.5rem' icon='tabler:search' onClick={() => setOpenDialog(true)} />
        </Box>
        <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
          <UserDropdown settings={settings} />
        </Box>
      </Box>
    </>
  )
}

export default AppBarContent
