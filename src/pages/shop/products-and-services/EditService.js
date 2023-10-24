import { useEffect, useState, useCallback, useRef } from 'react'
import { useLoader } from 'src/hooks'
import { Network, Url, multipartConfig } from 'src/configs'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import {
  Card,
  CardContent,
  Box,
  CardHeader,
  CardActions,
  Button,
  Grid,
  MenuItem,
  Typography,
  Divider,
  IconButton,
  Input
} from '@mui/material'
import { showErrorMessage, showSuccessMessage } from 'src/components'
import Webcam from 'react-webcam'

const EditService = () => {
  const [categories, setCategories] = useState([])
  const [chargeBy, setChargeBy] = useState([])
  const [serviceResponses, setServiceResponses] = useState([])
  const [currentResponse, setCurrentResponse] = useState(1)
  const [imagesLinks, setImagesLinks] = useState([])
  const [base64Images, setBase64Images] = useState([])
  const [images, setImages] = useState([])
  const [activeResponse, setActiveResponse] = useState(0)
  const [allResponses, setAllResponses] = useState([])
  const router = useRouter()
  const { query } = router
  const { setLoader } = useLoader()
  const webcamRef = useRef(null)
  const FACING_MODE_USER = 'user'
  const FACING_MODE_ENVIRONMENT = 'environment'
  const [facingMode, setFacingMode] = useState(FACING_MODE_ENVIRONMENT)

  const videoConstraints = {
    facingMode: FACING_MODE_ENVIRONMENT
  }

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    rate: yup.number().required(),
    category_name: yup.string().required('category is required'),
    charge_by: yup.string().required('charge by is required')
  })

  const {
    control,
    setError,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      category_name: '',
      rate: '',
      charge_by: ''
    }
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
    if (base64Images.length == 0) return showErrorMessage('Please Select Images')
    setLoader(true)
    const response = await Network.put(Url.createService(query.shopId, query.serviceId), data)
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

  const handleDeleteUploadedImages = async (index, id) => {
    setLoader(true)
    const response = await Network.delete(Url.deleteServiceImage(query.shopId, query.serviceId, id))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    handleDeleteImage(index)
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()

    setBase64Images(prev => [...prev, imageSrc])
  }, [webcamRef])

  const switchCamera = useCallback(() => {
    setFacingMode(prevState => (prevState === FACING_MODE_USER ? FACING_MODE_ENVIRONMENT : FACING_MODE_USER))
  }, [])

  const getService = async () => {
    setLoader(true)
    const response = await Network.get(Url.getService(query.shopId, query.serviceId))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setValue('name', response.data.name)
    setValue('description', response.data.description)
    setValue('rate', response.data.rate)
    setValue('category_name', response.data.category_name)
    setValue('charge_by', response.data.charge_by)
    setBase64Images(response.data.images)
  }

  const recognizeImage = async id => {
    setLoader(true)
    const response = await Network.get(Url.recognizeServiceImages(query.shopId, query.serviceId, id))
    setLoader(false)
    setAllResponses(response.data)

    reset({
      name: response.data[0]?.name,
      description: response.data[0]?.description,
      category_name: response.data[0]?.category_name,
      charge_by: response.data[0]?.charge_by,
      rate: ''
    })
  }

  const onNext = () => {
    if (activeResponse < 5) {
      reset({
        name: allResponses[activeResponse + 1]?.name,
        description: allResponses[activeResponse + 1]?.description,
        category_name: allResponses[activeResponse + 1]?.category_name,
        rate: allResponses[activeResponse + 1]?.rate,
        charge_by: allResponses[activeResponse + 1]?.charge_by
      })

      setActiveResponse(activeResponse + 1)
    }
  }

  const onPrev = () => {
    if (activeResponse > 0) {
      reset({
        name: allResponses[activeResponse - 1]?.name,
        description: allResponses[activeResponse - 1]?.description,
        category_name: allResponses[activeResponse - 1]?.category_name,
        rate: allResponses[activeResponse - 1]?.rate,
        charge_by: allResponses[activeResponse - 1]?.charge_by
      })

      setActiveResponse(activeResponse - 1)
    }
  }

  const uploadImages = async () => {
    if (base64Images.length == 0) return showErrorMessage('Please Select Images')
    const formData = new FormData()
    images.map(image => {
      formData.append('images[]', image)
    })

    setLoader(true)

    const response = await Network.put(
      Url.uploadServicestMoreImages(query.shopId, query.serviceId),
      formData,
      (
        await multipartConfig()
      ).headers
    )
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setImagesLinks(response.data.services.images)
    showSuccessMessage(response.data.message)
  }

  const uploadMore = async () => {
    if (base64Images.length == 0) return showErrorMessage('Please Select Images')

    const images = base64Images.filter(image => {
      if (typeof image != 'object') return image
    })

    const formData = new FormData()
    images.map(image => {
      formData.append('images[]', image)
    })

    setLoader(true)

    const response = await Network.put(
      Url.uploadServicestMoreImages(query.shopId, query.serviceId),
      formData,
      (
        await multipartConfig()
      ).headers
    )
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setBase64Images(response.data.services.images)
  }

  useEffect(() => {
    getService()
    newServiceForm()
  }, [])

  return (
    <>
      <Card sx={{ p: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={5}>
            <Typography sx={{ mb: 4 }} fontSize={20}>
              Service Images
            </Typography>
            <Grid container>
              <Webcam
                width={'330rem'}
                maxWidth={'400px'}
                audio={false}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                videoConstraints={{
                  ...videoConstraints,
                  facingMode
                }}
              />
            </Grid>
            <Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'start', mt: 2 }}>
              <Button onClick={capture} variant='contained' sx={{ mr: 2 }}>
                Capture
              </Button>
              <Button variant='outlined' size='small' onClick={switchCamera}>
                <Icon icon='tabler:refresh' />
              </Button>
            </Grid>
          </Grid>
          {base64Images?.map((image, index) => {
            if (typeof image == 'object')
              return (
                <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Card
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <IconButton
                      color='secondary'
                      sx={{ m: 2 }}
                      onClick={() => handleDeleteUploadedImages(index, image.id)}
                    >
                      <Icon icon='tabler:trash' fontSize={25} />
                    </IconButton>
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.path}`}
                      alt='Service image'
                      style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                    />
                    <Button sx={{ m: 2 }} onClick={() => recognizeImage(image.id)}>
                      Recognize Image
                    </Button>
                  </Card>
                </Grid>
              )
            else
              return (
                <Grid
                  item
                  key={index}
                  xs={12}
                  md={3}
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Card
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <IconButton color='secondary' sx={{ m: 2 }} onClick={() => handleDeleteImage(index)}>
                      <Icon icon='tabler:trash' fontSize={25} />
                    </IconButton>
                    <img
                      src={image}
                      alt='Service image'
                      style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                    />
                    <p sx={{ m: 2 }} style={{ color: '#C94E50' }}>
                      Not Uploaded
                    </p>
                  </Card>
                </Grid>
              )
          })}
        </Grid>

        <Divider
          sx={{
            color: 'text.disabled',
            '& .MuiDivider-wrapper': { px: 6 },
            mt: 2,
            mb: 3
          }}
        >
          or
        </Divider>
        <Input type='file' accept='image/*' onChange={event => handleServicesImages(event)} multiple capture />

        <CardActions sx={{ justifyContent: 'end' }}>
          <Button variant='contained' onClick={() => uploadMore()}>
            Upload More
          </Button>
        </CardActions>
      </Card>

      <Card sx={{ mt: 4 }}>
        <CardHeader title='Add Service' />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Button type='button' variant='contained' disabled={activeResponse === 0} onClick={() => onPrev()}>
              Prev
            </Button>
            <Button type='button' variant='contained' disabled={activeResponse === 4} onClick={() => onNext()}>
              Next
            </Button>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                  defaultValue='category_name'
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => {
                    console.log({ value })

                    return (
                      <CustomTextField
                        select
                        fullWidth
                        label='Category'
                        value={value}
                        id='select-controlled'
                        onBlur={onBlur}
                        placeholder='Category'
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
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='charge_by'
                  control={control}
                  defaultValue='charge_by'
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
                onClick={() => router.push(`/shop/products-and-services?shopId=${query.shopId}`)}
              >
                Back
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

EditService.acl = {
  subject: 'edit-service',
  action: 'read'
}

export default EditService
