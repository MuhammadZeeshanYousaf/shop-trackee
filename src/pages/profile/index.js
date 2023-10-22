import Grid from '@mui/material/Grid'
import UserProfileHeader from './UserProfileHeader'
import UserProfile from './UserProfile'
import { Network, Url } from '../../configs'
import { useEffect, useState } from 'react'
import { showErrorMessage, showSuccessMessage, showWarningMessage } from 'src/components'
import { useLoader } from 'src/hooks'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

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

  const [values, setValues] = useState({
    prevPassword: '',
    showPrevPassword: false,
    newPassword: '',
    showNewPassword: false
  })

  // Handle Prev Password
  const handlePrevPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPrevPassword = () => {
    setValues({ ...values, showPrevPassword: !values.showPrevPassword })
  }

  // Handle New Password
  const handleNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const changePassword = async () => {
    setLoader(true)
    const formData = new FormData()
    formData.append('prev_password', values.prevPassword)
    formData.append('new_password', values.newPassword)
    const response = await Network.post(Url.updatePassword, formData)
    console.log(formData)
    setLoader(false)

    if (!response) showWarningMessage('Unable to change password')
    else if (response.data?.ok) showSuccessMessage(response.data?.message)
    else if (!response.data?.ok) showErrorMessage(response.data?.message)
  }

  const changePasswordSubmitHandler = e => {
    e.preventDefault()
    changePassword()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader user={user} />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={5}>
            <UserProfile user={user} />
          </Grid>
          <Grid item xs={12} md={7}>
            <Card>
              <CardHeader
                title={
                  <Typography style={{ fontSize: '13px' }} color={'secondary'}>
                    CHANGE PASSWORD
                  </Typography>
                }
              />
              <CardContent>
                <form onSubmit={changePasswordSubmitHandler}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label='Previous Password'
                        placeholder='············'
                        id='outlined-basic'
                        value={values.prevPassword}
                        onChange={handlePrevPasswordChange('prevPassword')}
                        type={values.showPrevPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowPrevPassword}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <Icon
                                  fontSize='1.25rem'
                                  icon={values.showPrevPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        placeholder=''
                        label='New Password'
                        value={values.newPassword}
                        type={values.showNewPassword ? 'text' : 'password'}
                        onChange={handleNewPasswordChange('newPassword')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                                onClick={handleClickShowNewPassword}
                              >
                                <Icon
                                  fontSize='1.25rem'
                                  icon={values.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button type='submit' variant='contained'>
                        Change Password
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
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
