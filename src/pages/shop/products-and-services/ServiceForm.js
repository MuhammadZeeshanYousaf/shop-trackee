import { useRouter } from 'next/router'
import { Url, Network, multipartConfig } from '../../../configs'
import { useEffect, useState, useCallback, useRef } from 'react'
import { showErrorMessage, showSuccessMessage } from 'src/components'
import { useLoader } from 'src/hooks'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import Webcam from 'react-webcam'

import {
  Grid,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  MenuItem,
  Button,
  Typography,
  Box,
  Divider
} from '@mui/material'

const ServiceForm = () => {
  const router = useRouter()
  const { setLoader } = useLoader()
  const { query } = useRouter()
  const [categories, setCategories] = useState([])
  const [chargeBy, setChargeBy] = useState([])
  const [services, setServices] = useState(null)
  const [serviceResponses, setServiceResponses] = useState([])
  const [currentResponse, setCurrentResponse] = useState(1)
  const [base64Images, setBase64Images] = useState([])
  const webcamRef = useRef(null)

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    rate: yup.number().required(),
    category_name: yup.string().required('category is required'),
    charge_by: yup.string().required('charge by is required')
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
      category_name: '',
      rate: '',
      charge_by: ''
    },
    resolver: yupResolver(schema)
  })

  const newServiceForm = async () => {
    setLoader(true)
    const response = await Network.get(Url.newService(query.shopId))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)

    setCategories(response.data.categories)
    setChargeBy(response.data.service.charge_by)
  }

  const onSubmit = async data => {
    setLoader(true)
    const response = await Network.put(Url.createService(query.shopId, services?.id), data)
    setLoader(false)
    if (!response) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    router.push(`/shop/products-and-services?shopId=${query.shopId}`)
  }

  const handleServicesImages = event => {
    const serviceImages = Array.from(event.target.files)
    Promise.all(
      serviceImages.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()

          reader.onload = e => {
            resolve(e.target.result)
          }

          reader.onerror = error => {
            reject(error)
          }

          reader.readAsDataURL(file)
        })
      })
    )
      .then(base64Images => {
        setBase64Images(prev => [...prev, ...base64Images])
      })
      .catch(error => {
        console.error('Error converting images to base64:', error)
      })
  }

  const handleDeleteImage = index => {
    const updatedImages = [...base64Images]
    updatedImages.splice(index, 1)
    setBase64Images(updatedImages)
  }
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()

    setBase64Images(prev => [...prev, imageSrc])
  }, [webcamRef])

  const uploadImages = async () => {
    if (base64Images.length == 0) return showErrorMessage('Please Select Images')
    const formData = new FormData()
    base64Images.map(image => {
      formData.append('images[]', image)
    })
    setLoader(true)
    const response = await Network.put(
      Url.uploadServiceImages(query.shopId),
      formData,
      (
        await multipartConfig()
      ).headers
    )
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    setServices(response.data.services)
    setBase64Images(response.data.services.images)
  }

  const handleDeleteUploadedImages = async (index, id) => {
    setLoader(true)
    const response = await Network.delete(Url.deleteServiceImage(query.shopId, services?.id, id))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    handleDeleteImage(index)
  }

  const setResponse = () => {
    setValue('name', serviceResponses[currentResponse]?.name)
    setValue('description', serviceResponses[currentResponse]?.description)
    setValue('rate', serviceResponses[currentResponse]?.rate)
    setValue('charge_by', serviceResponses[currentResponse]?.charge_by)
    setValue('category_name', serviceResponses[currentResponse]?.category_name)
  }

  const recognizeImage = async id => {
    setLoader(true)
    const response = await Network.get(Url.recognizeServiceImages(query.shopId, services?.id, id))
    setLoader(false)

    reset({
      name: response.data[0]?.name,
      description: response.data[0]?.description,
      category_name: response.data[0]?.category_name,
      charge_by: response.data[0]?.charge_by,
      rate: ''
    })
  }

  const nextReponse = () => {
    if (currentResponse > 4) return
    setCurrentResponse(prev => prev + 1)
    setResponse()
  }

  const previousReponse = () => {
    if (currentResponse < 1) return
    setCurrentResponse(prev => prev - 1)
    setResponse()
  }

  const uploadMore = async () => {
    const images = base64Images.filter(image => {
      if (typeof image != 'object') return image
    })

    const formData = new FormData()
    images.map(image => {
      formData.append('images[]', image)
    })

    setLoader(true)
    const response = await Network.put(
      Url.uploadServicestMoreImages(query.shopId, services?.id),
      formData,
      (
        await multipartConfig()
      ).headers
    )
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setBase64Images(response.data.services.images)
  }

  // useEffect(() => {
  //   setResponse()
  // }, [serviceResponses, currentResponse])

  useEffect(() => {
    newServiceForm()
  }, [])

  return (
    <>
      <Grid container>
        <Webcam height={200} width={200} audio={false} ref={webcamRef} screenshotFormat='image/jpeg' />
      </Grid>

      <Card sx={{ p: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={12}>
            <Typography sx={{ mb: 2 }}>Service Images</Typography>
            <input type='file' onChange={event => handleServicesImages(event)} multiple capture />
            <Divider
              sx={{
                color: 'text.disabled',
                '& .MuiDivider-wrapper': { px: 6 }
              }}
            >
              or
            </Divider>
            <button onClick={capture}>Capture photo</button>
          </Grid>
          {base64Images?.map((image, index) => {
            if (typeof image == 'object')
              return (
                <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card>
                    <CardHeader
                      title={
                        <Icon
                          icon='tabler:trash'
                          fontSize={20}
                          onClick={() => handleDeleteUploadedImages(index, image.id)}
                        />
                      }
                    />
                    <CardContent>
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.path}`}
                        style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                      />
                    </CardContent>
                    <CardActions>
                      <Button onClick={() => recognizeImage(image.id)}>Recognize Image</Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            else {
              return (
                <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card>
                    <CardHeader
                      title={<Icon icon='tabler:trash' fontSize={20} onClick={() => handleDeleteImage(index)} />}
                    />
                    <CardContent>
                      <img src={image} style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }} />
                    </CardContent>
                  </Card>
                </Grid>
              )
            }
          })}
        </Grid>
        <CardActions sx={{ justifyContent: 'end' }}>
          {base64Images.some(item => typeof item === 'object') ? (
            <Button variant='contained' onClick={() => uploadMore()}>
              Upload More
            </Button>
          ) : (
            <Button variant='contained' onClick={() => uploadImages()}>
              Upload
            </Button>
          )}
        </CardActions>
      </Card>
      {/* <Card sx={{ p: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={12}>
            <Typography sx={{ mb: 2 }}>Services Images</Typography>
            <input type='file' onChange={event => handleServicesImages(event)} multiple capture />
          </Grid>
          {imagesLinks.length > 0
            ? imagesLinks.map(({ id, path }) => {
                return (
                  <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card>
                      <CardHeader
                        title={
                          <Icon icon='tabler:trash' fontSize={20} onClick={() => handleDeleteUploadedImages(id)} />
                        }
                      />
                      <CardContent>
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`}
                          style={{ objectFit: 'cover', maxHeight: '100%', maxWidth: '100%' }}
                        />
                      </CardContent>
                      <CardActions>
                        <Button onClick={() => recognizeImage(id)}>Recognize Image</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                )
              })
            : images?.map((image, index) => {
                return (
                  <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card>
                      <CardHeader
                        title={<Icon icon='tabler:trash' fontSize={20} onClick={() => handleDeleteImage(index)} />}
                      />
                      <CardContent>
                        <img
                          src={URL.createObjectURL(image)}
                          style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
        </Grid>
        <CardActions sx={{ justifyContent: 'end' }}>
          <Button variant='contained' onClick={() => uploadImages()}>
            Upload
          </Button>
        </CardActions>
      </Card> */}

      {base64Images.length > 0 ? (
        <Card sx={{ mt: 4 }}>
          <CardHeader title='Add Service' />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => previousReponse()}>Previous</Button>
              <Button onClick={() => nextReponse()}>Next</Button>
            </Box> */}
              <Grid container spacing={5}>
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
                        placeholder='Enter service name'
                        error={Boolean(errors.name)}
                        {...(errors.name && { helperText: errors.name.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='rate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Rate'
                        type='number'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder='Enter service rate'
                        error={Boolean(errors.rate)}
                        {...(errors.rate && { helperText: errors.rate.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='category_name'
                    control={control}
                    defaultValue={' '}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        select
                        fullWidth
                        label='Category'
                        id='select-controlled'
                        value={value}
                        onBlur={onBlur}
                        placeholder='category'
                        error={Boolean(errors.category_name)}
                        {...(errors.category_name && { helperText: errors.category_name.message })}
                        SelectProps={{
                          value,
                          onChange
                        }}
                      >
                        {categories?.map(category => {
                          return <MenuItem value={category}>{category}</MenuItem>
                        })}
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='charge_by'
                    control={control}
                    defaultValue=''
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        select
                        fullWidth
                        label='Charge by'
                        value={value}
                        id='select-controlled'
                        onBlur={onBlur}
                        placeholder='charge by'
                        error={Boolean(errors.charge_by)}
                        {...(errors.charge_by && { helperText: errors.charge_by.message })}
                        SelectProps={{
                          value,
                          onChange
                        }}
                      >
                        {chargeBy?.map(i => {
                          return <MenuItem value={i}>{i}</MenuItem>
                        })}
                      </CustomTextField>
                    )}
                  />
                </Grid>
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
                        {...(errors.description && { helperText: errors.description.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <CardActions sx={{ justifyContent: 'end' }}>
                <Button type='submit' variant='contained'>
                  Submit
                </Button>
                <Button
                  type='reset'
                  color='secondary'
                  variant='tonal'
                  onClick={() => router.push(`/shop /products-and-services?shopId=${query.shopId}`)}
                >
                  Back
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </>
  )
}

ServiceForm.acl = {
  subject: 'service-form',
  action: 'read'
}

export default ServiceForm
