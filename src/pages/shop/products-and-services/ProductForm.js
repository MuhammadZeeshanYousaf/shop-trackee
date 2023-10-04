import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Button,
  CardActions,
  Typography,
  Box,
  MenuItem,
  Divider
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef, useCallback } from 'react'
import Icon from 'src/@core/components/icon'
import { showErrorMessage, showSuccessMessage } from 'src/components'
import { Network, Url, multipartConfig } from '../../../configs'
import { useLoader } from 'src/hooks'
import Webcam from 'react-webcam'

const ProductForm = () => {
  const router = useRouter()
  const { query } = router
  const { setLoader } = useLoader()
  const webcamRef = useRef(null)

  const FACING_MODE_USER = 'user'
  const FACING_MODE_ENVIRONMENT = 'environment'

  const videoConstraints = {
    facingMode: FACING_MODE_USER
  }

  const [product, setProduct] = useState(null)
  const [productResponses, setProductResponses] = useState([])
  const [currentResponse, setCurrentResponse] = useState(0)
  const [allResponses, setAllResponses] = useState([])
  const [categories, setCategories] = useState([])

  const [base64Images, setBase64Images] = useState([])
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER)

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    price: yup.number().required(),
    stock_quantity: yup.number().required('quantity is required'),
    category_name: yup.string().required('category is required')
  })

  const {
    control,
    setError,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,

    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category_name: ''
    }
  })

  const newProductForm = async () => {
    setLoader(true)
    const response = await Network.get(Url.newProduct(query.shopId))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)

    setCategories(response.data.categories)
  }

  const handleProductImages = event => {
    const productImages = Array.from(event.target.files)
    Promise.all(
      productImages.map(file => {
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
    const response = await Network.delete(Url.deleteProductImage(query.shopId, product?.id, id))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    handleDeleteImage(index)
    showSuccessMessage(response.data.message)
  }

  const uploadImages = async () => {
    if (base64Images.length == 0) return showErrorMessage('Please Select Images')
    const formData = new FormData()
    base64Images.map(image => {
      formData.append('images[]', image)
    })
    setLoader(true)
    const response = await Network.put(Url.uploadImages(query.shopId), formData, (await multipartConfig()).headers)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    setProduct(response.data.products)
    setBase64Images(response.data.products.images)
  }

  const recognizeImage = async id => {
    setLoader(true)
    const response = await Network.get(Url.recognizeProductImages(query.shopId, product?.id, id))
    setLoader(false)
    setAllResponses(response.data)
    reset({
      name: response.data[0]?.name,
      description: response.data[0]?.description,
      category_name: response.data[0]?.category_name,
      price: response.data[0]?.price
    })
    // setValue('name', response.data[1]?.name)
    // setValue('description', response.data[1]?.description)
    // setValue('category_name', response.data[1]?.category_name)
    // setValue('price', response.data[1]?.price)
    // setCurrentResponse(1)
  }

  const setResponse = () => {
    setValue('name', productResponses[currentResponse]?.name)
    setValue('description', productResponses[currentResponse]?.description)
    setValue('price', 10)
    setValue('stock_quantity', productResponses[currentResponse]?.stock_quantity)
    setValue('category_name', productResponses[currentResponse]?.category_name)
  }

  const nextReponse = () => {
    const currentIndex = allResponses.indexOf(getValues())

    const index = currentResponse
    console.log({ currentResponse })
    reset(
      {
        name: allResponses[currentResponse]?.name,
        description: allResponses[currentResponse]?.description,
        category_name: allResponses[currentResponse]?.category_name,
        price: allResponses[currentResponse]?.price
      },
      { keepDirtyValues: true, keepDirty: true }
    )
    // if (currentResponse > 4) return

    // console.log(allResponses[currentResponse])

    // setValue('name', allResponses[currentResponse]?.name)
    // setValue('description', allResponses[currentResponse]?.description)
    // setValue('category_name', allResponses[currentResponse]?.category_name)
    // setValue('price', allResponses[currentResponse]?.price)
  }

  const previousReponse = () => {
    if (currentResponse < 0) return
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
      Url.uploadProductMoreImages(query.shopId, product?.id),
      formData,
      (
        await multipartConfig()
      ).headers
    )
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setProduct(response.data.products)
    setBase64Images(response.data.products.images)
  }

  const onSubmit = async data => {
    setLoader(true)
    const response = await Network.put(Url.createProduct(query.shopId, product?.id), data)
    setLoader(false)
    if (!response) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)

    router.push(`/shop/products-and-services?shopId=${query.shopId}`)

    // if (images.length == 0) return showErrorMessage('Please Select Images')
    // const formData = new FormData()
    // formData.append('name', data.name)
    // formData.append('images[]', images)
    // formData.append('description', data.description)
    // formData.append('price', data.price)
    // formData.append('stock_quantity', data?.stock_quantity)
    // formData.append('category_name', data.category_name)
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()

    setBase64Images(prev => [...prev, imageSrc])
  }, [webcamRef])

  const switchCamera = useCallback(() => {
    setFacingMode(prevState => (prevState === FACING_MODE_USER ? FACING_MODE_ENVIRONMENT : FACING_MODE_USER))
  }, [])

  // Capture the image using webcam

  useEffect(() => {
    setResponse()
  }, [productResponses, currentResponse])

  useEffect(() => {
    newProductForm()
  }, [])

  return (
    <>
      <Grid container>
        <Grid item md={6} xs={12}>
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
        </Grid>
        <Grid item md={6} xs={12} sx={{ justifyContent: 'end', display: 'flex' }}>
          <Button onClick={switchCamera}>Switch camera</Button>
        </Grid>
      </Grid>

      <Card sx={{ p: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={12}>
            <Typography sx={{ mb: 2 }}>Product Images</Typography>
            <input type='file' onChange={event => handleProductImages(event)} multiple capture />
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

      {base64Images.length > 0 ? (
        <Card sx={{ mt: 5 }}>
          <CardHeader title='Add Product' />

          <CardContent>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => previousReponse()}>Previous</Button>
              <Button
                onClick={() => {
                  setCurrentResponse(prev => prev + 1)
                  nextReponse()
                }}
              >
                Next
              </Button>
            </Box> */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5} sx={{ marginTop: '5px' }}>
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
                        placeholder='Enter product name'
                        error={Boolean(errors.name)}
                        {...(errors.name && { helperText: errors.name.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='price'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Price'
                        type='number'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder='Enter product price'
                        error={Boolean(errors.price)}
                        {...(errors.price && { helperText: errors.price.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='category_name'
                    control={control}
                    defaultValue={''}
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
                    name='stock_quantity'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Quantity'
                        type='number'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder='product quantity'
                        error={Boolean(errors.stock_quantity)}
                        {...(errors.stock_quantity && { helperText: errors.stock_quantity.message })}
                      />
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
      ) : null}
    </>
  )
}

ProductForm.acl = {
  subject: 'product-form',
  action: 'read'
}

export default ProductForm
