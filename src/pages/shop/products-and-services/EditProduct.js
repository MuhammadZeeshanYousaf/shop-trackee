import { useEffect, useState, useCallback, useRef } from 'react'
import { useLoader } from 'src/hooks'
import { Network, Url, multipartConfig } from '../../../configs'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Box,
  Button,
  CardActions,
  MenuItem,
  Typography,
  Divider
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { showErrorMessage, showSuccessMessage } from 'src/components'
import Icon from 'src/@core/components/icon'
import Webcam from 'react-webcam'

const EditProduct = () => {
  const { setLoader } = useLoader()
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [product, setProduct] = useState(null)
  const [imagesLinks, setImageLinks] = useState([])
  const [currentResponse, setCurrentResponse] = useState(1)
  const [base64Images, setBase64Images] = useState([])
  const [images, setImages] = useState([])
  const { query } = router
  const webcamRef = useRef(null)

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
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category_name: ''
    },
    resolver: yupResolver(schema)
  })

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()

    setBase64Images(prev => [...prev, imageSrc])
  }, [webcamRef])

  const newProductForm = async () => {
    setLoader(true)
    const response = await Network.get(Url.newProduct(query.shopId))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    console.log(response)
    setCategories(response.data.categories)
  }

  const getProduct = async () => {
    setLoader(true)
    const response = await Network.get(Url.getProduct(query.shopId, query.productId))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)

    console.log({ response })

    setProduct(response.data)
    setValue('name', response.data.name)
    setValue('description', response.data.description)
    setValue('category_name', response.data.category_name)
    setValue('price', response.data.price)
    setValue('stock_quantity', response.data.stock_quantity)
    // setImageLinks(response.data.images)
    setBase64Images(response.data.images)
  }

  const handleDeleteUploadedImages = async (index, id) => {
    setLoader(true)
    const response = await Network.delete(Url.deleteProductImage(query.shopId, query.productId, id))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    handleDeleteImage(index)
    showSuccessMessage(response.data.message)
  }

  const recognizeImage = async id => {
    setLoader(true)
    const response = await Network.get(Url.recognizeProductImages(query.shopId, query.productId, id))
    setLoader(false)

    reset({
      name: response.data[0]?.name,
      description: response.data[0]?.description,
      category_name: response.data[0]?.category_name,
      price: response.data[0]?.price,
      quantity: product?.quantity
    })
  }

  const handleDeleteImage = index => {
    const updatedImages = [...base64Images]
    updatedImages.splice(index, 1)
    setBase64Images(updatedImages)
  }

  const onSubmit = async data => {
    if (base64Images.length == 0) return showErrorMessage('Please Select Images')
    setLoader(true)
    const response = await Network.put(Url.createProduct(query.shopId, query.productId), data)
    setLoader(false)
    if (!response) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    router.push(`/shop/products-and-services?shopId=${query.shopId}`)
  }

  const setResponse = () => {
    setValue('name', product[currentResponse]?.name)
    setValue('description', product[currentResponse]?.description)
    setValue('price', 10)
    setValue('stock_quantity', product[currentResponse]?.stock_quantity)
    setValue('category_name', product[currentResponse]?.category_name)
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
      Url.uploadProductMoreImages(query.shopId, query.productId),
      formData,
      (
        await multipartConfig()
      ).headers
    )
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)

    setBase64Images(response.data.products.images)
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

  useEffect(() => {
    newProductForm()
    getProduct()
  }, [])

  return (
    <>
      <Grid container>
        <Webcam height={200} width={200} audio={false} ref={webcamRef} screenshotFormat='image/jpeg' />
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
          <Button variant='contained' onClick={() => uploadMore()}>
            Upload More
          </Button>
        </CardActions>
      </Card>

      <Card sx={{ mt: 5 }}>
        <CardHeader title='Edit Product' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => previousReponse()}>Previous</Button>
              <Button onClick={() => nextReponse()}>Next</Button>
            </Box> */}
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
                  defaultValue=''
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
    </>
  )
}

EditProduct.acl = {
  subject: 'edit-product',
  action: 'read'
}

export default EditProduct
