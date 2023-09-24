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
import { Network, Url, multipartConfig } from '../../configs'
import { useLoader } from 'src/hooks'
import Webcam from 'react-webcam'

const ProductForm = () => {
  const router = useRouter()
  const [images, setImages] = useState([])
  const { query } = router
  const { setLoader } = useLoader()
  const webcamRef = useRef(null)

  const [imagesLinks, setImagesLinks] = useState([])
  const [product, setProduct] = useState(null)
  const [productResponses, setProductResponses] = useState([])
  const [currentResponse, setCurrentResponse] = useState(1)
  const [categories, setCategories] = useState([])
  const [webcamOpen, setWebcamOpen] = useState(false)
  const [base64Images, setBase64Images] = useState([])

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
    resolver: yupResolver(schema)
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
    setImages(prevImg => [...prevImg, ...productImages])

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

  const handleDeleteUploadedImages = async id => {
    setLoader(true)
    const response = await Network.delete(Url.deleteProductImage(query.shopId, product?.id, id))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    const updatedImages = imagesLinks.filter(obj => obj.id != id)
    setImagesLinks(updatedImages)
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

    console.log({ response })
  }

  const recognizeImage = async id => {
    setLoader(true)
    const response = await Network.get(Url.recognizeProductImages(query.shopId, product?.id, id))
    setLoader(false)
    setProductResponses(response.data)
    setCurrentResponse(1)
  }

  const setResponse = () => {
    setValue('name', productResponses[currentResponse]?.name)
    setValue('description', productResponses[currentResponse]?.description)
    setValue('price', 10)
    setValue('stock_quantity', productResponses[currentResponse]?.stock_quantity)
    setValue('category_name', productResponses[currentResponse]?.category_name)
  }

  const nextReponse = () => {
    if (currentResponse > 4) return
    setCurrentResponse(prev => prev + 1)
    setResponse()
  }

  const previousReponse = () => {
    if (currentResponse < 0) return
    setCurrentResponse(prev => prev - 1)
    setResponse()
  }

  const uploadMore = () => {}

  const onSubmit = async data => {
    setLoader(true)
    const response = await Network.put(Url.createProduct(query.shopId, product?.id), data)
    setLoader(false)
    if (!response) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)

    router.push(`/products-and-services?shopId=${query.shopId}`)

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
    console.log(imageSrc)

    setBase64Images(prev => [...prev, imageSrc])
  }, [webcamRef])

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
        <Webcam height={200} width={200} audio={false} ref={webcamRef} screenshotFormat='image/jpeg' />
      </Grid>

      {/* <button onClick={capture}>Capture</button> */}
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
          })}
        </Grid>
        <CardActions sx={{ justifyContent: 'end' }}>
          <Button variant='contained' onClick={() => uploadImages()}>
            Upload
          </Button>
        </CardActions>
      </Card>

      {imagesLinks.length > 0 ? (
        <Card sx={{ mt: 5 }}>
          <CardHeader title='Add Product' />

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => previousReponse()}>Previous</Button>
                <Button onClick={() => nextReponse()}>Next</Button>
              </Box>

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
                    defaultValue='category_name'
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
                  onClick={() => router.push('/products-and-services')}
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
