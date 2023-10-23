import {
  CardHeader,
  Divider,
  Card,
  CardContent,
  Grid,
  Button,
  CardActions,
  Switch,
  FormLabel,
  FormControlLabel
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import MenuItem from '@mui/material/MenuItem'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { Network, Url, multipartConfig } from '../../configs'
import { useRouter } from 'next/router'
import { showErrorMessage, showSuccessMessage } from 'src/components'
import { useLoader } from 'src/hooks'
import { getValue } from '@mui/system'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))

const EditUserProfile = () => {
  const [inputValue, setInputValue] = useState(null)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const router = useRouter()
  const { setLoader } = useLoader()

  const schema = yup.object().shape({
    name: yup.string().required(),
    phone: yup.string().required(),
    country: yup.string().required(),
    address: yup.string().required(),
    gender: yup.string().required(),
    vocation: yup.string().required(),
    age: yup.number().required(),
    newsletter_subscribed: yup.boolean().required()
  })

  useEffect(() => {
    getUser()
  }, [])

  const {
    control,
    setError,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('phone', data.phone)
    formData.append('country', data.country)
    formData.append('address', data.address)
    formData.append('gender', data.gender)
    formData.append('vocation', data.vocation)
    formData.append('age', data.age)
    formData.append('newsletter_subscribed', data.newsletter_subscribed ? 'true' : 'false')
    if (inputValue) formData.append('avatar', inputValue)
    setLoader(true)
    const response = await Network.put(Url.updateUser, formData, (await multipartConfig()).headers)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)

    localStorage.setItem('userData', JSON.stringify(response.data.user))
    showSuccessMessage(response.data.message)
    router.push('/profile')
  }

  const getUser = async () => {
    setLoader(true)
    const response = await Network.get(Url.getUser)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setValue('name', response.data.resource_owner.name)
    setValue('phone', response.data.resource_owner.phone)
    setValue('country', response.data.resource_owner.country)
    setValue('address', response.data.resource_owner.address)
    setValue('gender', response.data.resource_owner.gender)
    setValue('vocation', response.data.resource_owner.vocation)
    setValue('age', response.data.resource_owner.age)
    setValue('newsletter_subscribed', response.data.resource_owner.newsletter_subscribed)

    if (response.data.resource_owner?.avatar) {
      setImgSrc(`${process.env.NEXT_PUBLIC_IMAGE_URL}/${response.data.resource_owner?.avatar}`)
    }
  }

  const handleInputImageChange = e => {
    const reader = new FileReader()
    setInputValue(e.target.files[0])
    reader.onloadend = () => {
      setImgSrc(reader.result)
    }
    const result = reader.readAsDataURL(e.target.files[0])
    setImgSrc(result)
  }

  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/1.png')
  }

  return (
    <Card>
      <CardHeader title='Profile Details' />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ImgStyled src={imgSrc} alt='Profile Pic' />
          <div>
            <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
              Upload New Photo
              <input
                hidden
                type='file'
                accept='image/png, image/jpeg'
                onChange={e => handleInputImageChange(e)}
                id='account-settings-upload-image'
              />
            </ButtonStyled>
            <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
              Reset
            </ResetButtonStyled>
            <Typography sx={{ mt: 4, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
          </div>
        </Box>
      </CardContent>
      <Divider />
      <CardContent>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Controller
                name='name'
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='Name'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Enter your name'
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='gender'
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    select
                    label='Gender'
                    id='form-layouts-separator-multiple-select'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Enter your name'
                    error={Boolean(errors.gender)}
                    {...(errors.gender && { helperText: errors.gender.message })}
                  >
                    <MenuItem value='Male'>Male</MenuItem>
                    <MenuItem value='Female'>Female</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='phone'
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    label='Phone No.'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Enter your phone #'
                    error={Boolean(errors.phone)}
                    {...(errors.phone && { helperText: errors.phone.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='country'
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Country'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Enter your country'
                    error={Boolean(errors.country)}
                    {...(errors.country && { helperText: errors.country.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='address'
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Address'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Enter your address'
                    error={Boolean(errors.address)}
                    {...(errors.address && { helperText: errors.address.message })}
                  />
                )}
              />
              {/* <CustomTextField fullWidth label='Address' placeholder='Address' /> */}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='vocation'
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Vocation'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Enter your vocation'
                    error={Boolean(errors.vocation)}
                    {...(errors.vocation && { helperText: errors.vocation.message })}
                  />
                )}
              />
              {/* <CustomTextField fullWidth label='Address' placeholder='Address' /> */}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='age'
                control={control}
                defaultValue={0}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Age'
                    value={value}
                    type='number'
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder='Enter your age'
                    error={Boolean(errors.age)}
                    {...(errors.age && { helperText: errors.age.message })}
                  />
                )}
              />
              {/* <CustomTextField fullWidth label='Address' placeholder='Address' /> */}
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Subscribe to the News Letter</FormLabel>
              <Controller
                control={control}
                name='newsletter_subscribed'
                defaultValue={false}
                render={({ field: { value, onChange } }) => {
                  return <Switch checked={value} value={value} onChange={onChange} />
                }}
              />
            </Grid>
          </Grid>
          <CardActions sx={{ justifyContent: 'end' }}>
            <Button type='submit' variant='contained'>
              Submit
            </Button>
            <Button type='reset' color='secondary' variant='tonal' onClick={() => router.push('/profile')}>
              Back
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}

EditUserProfile.acl = {
  subject: 'edit-user-profile',
  action: 'read'
}
export default EditUserProfile
