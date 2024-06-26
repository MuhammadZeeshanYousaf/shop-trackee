import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormLabel,
  Grid,
  MenuItem,
  CardActions,
  Box,
  InputLabel
} from '@mui/material'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomChip from 'src/@core/components/mui/chip'
import { useForm, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { useTheme } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import Icon from 'src/@core/components/icon'
import { geocodeByPlaceId } from 'react-google-places-autocomplete'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { Network, Url } from '../../configs'
import {
  showErrorMessage,
  showSuccessMessage,
  CustomInput,
  DatePickerWrapper,
  showWarningMessage
} from '../../components'
import { useLoader } from '../../hooks'
import { Map } from '../../components'

const Form = () => {
  const router = useRouter()
  const { mode, id } = router.query

  const theme = useTheme()
  const { direction } = theme
  const { setLoader } = useLoader()

  const [longitude, setLongitude] = useState(null)
  const [latitude, setLatitude] = useState(null)

  const [socialLinks, setSocialLinks] = useState([
    {
      id: uuid(),
      link: ''
    }
  ])

  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8

  const MenuProps = {
    PaperProps: {
      style: {
        width: 250,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  }

  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    address: yup.object().nullable(),
    contact: yup.string().required(),
    opening_time: yup.string(),
    closing_time: yup.string(),
    closing_days: yup.array()
  })

  const {
    control,
    setError,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const addLink = () => {
    const obj = {
      id: uuid(),
      link: ''
    }

    setSocialLinks(prev => [...prev, obj])
  }

  const deleteLink = linkId => {
    const updatedLinks = socialLinks.filter(({ id }) => id !== linkId)
    setSocialLinks(updatedLinks)
  }

  const handleLinks = (e, changeId) => {
    const { value } = e.target

    const updatedData = socialLinks.map(item => {
      if (changeId == item.id) {
        return { ...item, link: value }
      }

      return item
    })

    setSocialLinks(updatedData)
  }

  const onSubmit = async data => {
    const social_links = []
    socialLinks.forEach(item => {
      social_links.push(item.link)
    })

    const payload = {
      ...data,
      social_links,
      longitude: longitude,
      latitude: latitude
    }

    if (payload.opening_time > payload.closing_time || payload.opening_time === payload.closing_time) {
      showErrorMessage('Opening and Closing Time are invalid')

      return
    }

    if (payload.latitude === null || payload.longitude === null) {
      showWarningMessage('Please select Shop address or allow your location')

      return
    }

    let request, route, message

    if (mode == 'Add') {
      request = 'post'
      route = Url.getShops
      message = 'Shop created successfully'
    } else {
      request = 'put'
      route = `${Url.getShops}/${id}`
      message = 'Shop updated successfully'
    }

    setLoader(true)
    const response = await Network[request](route, payload)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(message)
    router.push('/shop')
  }

  const getShop = async () => {
    setLoader(true)
    const response = await Network.get(`${Url.getShops}/${id}`)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setValue('name', response.data.name)
    setValue('description', response.data.description)
    setValue('address', response.data.address)
    setValue('contact', response.data.contact)
    setValue('opening_time', response.data.opening_time ? new Date(response.data.opening_time) : '')
    setValue('closing_time', response.data.closing_time ? new Date(response.data.closing_time) : '')
    setValue('closing_days', response.data.closing_days)
    setLongitude(response.data.longitude)
    setLatitude(response.data.latitude)

    const social_links = response.data.social_links.map(link => {
      return {
        id: uuid(),
        link
      }
    })
    setSocialLinks(social_links)
  }

  useEffect(() => {
    if (mode == 'Edit') {
      getShop()
    }
  }, [])

  useEffect(() => {
    if (mode !== 'Edit') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          setLoader(true)
          setLongitude(position?.coords?.longitude)
          setLatitude(position?.coords?.latitude)
          setLoader(false)
        }),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
      } else {
        showErrorMessage('It is better to select location')
      }
    }
  }, [])

  // console.log(getValues('address'))

  return (
    <>
      <Card>
        <CardHeader title={`${mode} Shop Details`} />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* name and contact */}
            <Map latitude={latitude} longitude={longitude} height='200px' />
            <Grid container spacing={5} sx={{ marginTop: '5px' }}>
              <Grid item xs={12} md={12} style={{ zIndex: 10 }}>
                <InputLabel>Address</InputLabel>
                <Controller
                  name='address'
                  control={control}
                  defaultValue={null}
                  rules={{ required: true }}
                  label='Address'
                  render={({ field: { onChange, value } }) => {
                    return (
                      <GooglePlacesAutocomplete
                        onLoadFailed={error => console.error('Could not inject Google script', error)}
                        fetchDetails={true}
                        selectProps={{
                          value: value,
                          onChange: async value => {
                            if (value) {
                              onChange(value)
                              const location = await geocodeByPlaceId(value.value.place_id)
                              setLongitude(location[0].geometry.location.lng())
                              setLatitude(location[0].geometry.location.lat())
                            }
                          },
                          isClearable: true
                        }}
                      />
                    )
                  }}
                />
                {errors.address && <span style={{ color: '#EC6364' }}>{errors.address.message}</span>}
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='name'
                  control={control}
                  defaultValue=''
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
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
              <Grid item xs={12} md={6}>
                <Controller
                  name='contact'
                  control={control}
                  defaultValue=''
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      type='tel'
                      label='Contact No.'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='Enter your phone #'
                      error={Boolean(errors.contact)}
                      {...(errors.contact && {
                        helperText: errors.contact.message
                      })}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* closing and opening time */}
            <Grid container spacing={5} sx={{ marginTop: '5px' }}>
              <Grid item xs={12} md={2}>
                <Controller
                  name='opening_time'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <DatePickerWrapper>
                      <Box className='demo-space-x'>
                        <DatePicker
                          autoComplete='off'
                          showTimeSelect
                          showTimeSelectOnly
                          selected={value}
                          timeIntervals={30}
                          dateFormat='h:mm aa'
                          id='time-only-picker'
                          popperPlacement={popperPlacement}
                          onChange={onChange}
                          customInput={<CustomInput label='Opening Time' />}
                          autocomplete='off'
                        />
                      </Box>
                    </DatePickerWrapper>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Controller
                  name='closing_time'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <DatePickerWrapper>
                      <Box className='demo-space-x'>
                        <DatePicker
                          autoComplete='off'
                          showTimeSelect
                          showTimeSelectOnly
                          selected={value}
                          timeIntervals={30}
                          dateFormat='h:mm aa'
                          id='time-only-picker'
                          popperPlacement={popperPlacement}
                          onChange={onChange}
                          customInput={<CustomInput label='Closing Time' />}
                        />
                      </Box>
                    </DatePickerWrapper>
                  )}
                />
              </Grid>
            </Grid>
            {/* closing Days */}
            <Grid container spacing={5} sx={{ marginTop: '5px' }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name='closing_days'
                  control={control}
                  defaultValue={[]}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => {
                    return (
                      <CustomTextField
                        select
                        fullWidth
                        label='Closing Days'
                        id='select-multiple-chip'
                        error={Boolean(errors.closing_days)}
                        {...(errors.closing_days && {
                          helperText: errors.closing_days.message
                        })}
                        SelectProps={{
                          MenuProps,
                          multiple: true,
                          value: value,
                          onChange: onChange,
                          renderValue: selected => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                              {selected.map(value => (
                                <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                              ))}
                            </Box>
                          )
                        }}
                      >
                        {week.map(day => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )
                  }}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                width: '100%',
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center',
                marginTop: '5px'
              }}
            >
              <FormLabel>Social Links</FormLabel>
              <Button onClick={() => addLink()}>
                <Icon icon='tabler:plus' fontSize={20} />
              </Button>
            </Box>

            {socialLinks.map(({ link, id }) => {
              return (
                <Grid container spacing={5} sx={{ alignItems: 'center' }} key={id}>
                  <Grid item xs={10} md={10}>
                    <CustomTextField
                      value={link}
                      onChange={e => handleLinks(e, id)}
                      sx={{ marginTop: '10px' }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <Icon icon='tabler:trash' fontSize={20} onClick={() => deleteLink(id)} />
                  </Grid>
                </Grid>
              )
            })}

            <Grid container spacing={5} sx={{ marginTop: '5px' }}>
              <Grid item xs={12} md={12}>
                <Controller
                  name='description'
                  control={control}
                  defaultValue=''
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      multiline
                      fullWidth
                      rows={4}
                      label='Description'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='Enter description'
                      error={Boolean(errors.description)}
                      {...(errors.description && {
                        helperText: errors.description.message
                      })}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={5} sx={{ marginTop: '5px' }}></Grid>

            <CardActions sx={{ justifyContent: 'end' }}>
              <Button type='submit' variant='contained'>
                Submit
              </Button>
              <Button type='reset' color='secondary' variant='tonal' onClick={() => router.push('/shop')}>
                Back
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

Form.acl = {
  subject: 'shop-form',
  action: 'read'
}

export default Form
