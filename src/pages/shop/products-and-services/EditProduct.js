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
  Divider,
  Input,
  IconButton
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
  const [allResponses, setAllResponses] = useState([])
  const [activeResponse, setActiveResponse] = useState(0)
  const { query } = router
  const webcamRef = useRef(null)
  const FACING_MODE_USER = 'user'
  const FACING_MODE_ENVIRONMENT = 'environment'

  const videoConstraints = {
    facingMode: FACING_MODE_ENVIRONMENT
  }
  const [facingMode, setFacingMode] = useState(FACING_MODE_ENVIRONMENT)

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
      stock_quantity: 1,
      price: '',
      category_name: ''
    },
    resolver: yupResolver(schema)
  })

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()

    setBase64Images(prev => [...prev, imageSrc])
  }, [webcamRef])

  const switchCamera = useCallback(() => {
    setFacingMode(prevState => (prevState === FACING_MODE_USER ? FACING_MODE_ENVIRONMENT : FACING_MODE_USER))
  }, [])

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

    let allCategories = []
    response.data.forEach(element => {
      if (!(categories.includes(element.category_name) && allCategories.includes(element.category_name))) {
        allCategories.push(element.category_name)
      }
    })
    setCategories(prevCategories => prevCategories.concat(allCategories))

    setAllResponses(response.data)

    reset({
      name: response.data[0]?.name,
      description: response.data[0]?.description,
      category_name: response.data[0]?.category_name,
      price: response.data[0]?.price,
      stock_quantity: product?.stock_quantity
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
    setValue('price', 0)
    setValue('stock_quantity', product[currentResponse]?.stock_quantity)
    setValue('category_name', product[currentResponse]?.category_name)
  }

  const onNext = () => {
    if (activeResponse < 5) {
      reset({
        name: allResponses[activeResponse + 1]?.name,
        description: allResponses[activeResponse + 1]?.description,
        category_name: allResponses[activeResponse + 1]?.category_name,
        price: allResponses[activeResponse + 1]?.price
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
        price: allResponses[activeResponse - 1]?.price
      })

      setActiveResponse(activeResponse - 1)
    }
  }

  const cancelOperation = async () => {
    // redirect
    router.push(`/shop/products-and-services?shopId=${query.shopId}`)
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
      <Card sx={{ p: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={5}>
            <Typography sx={{ mb: 4 }} fontSize={20}>
              Product Images
            </Typography>
            <Grid container>
              <Webcam
                width={'330rem'}
                audio={false}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                videoConstraints={{
                  ...videoConstraints,
                  facingMode
                }}
              />
            </Grid>
            <Grid item md={12} xs={12} sx={{ justifyContent: 'start', display: 'flex', mt: 2 }}>
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
                      alt='Product image'
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
                  md={2}
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Card
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <CardHeader
                      title={<Icon icon='tabler:trash' fontSize={20} onClick={() => handleDeleteImage(index)} />}
                    />
                    <img
                      src={image}
                      alt='Product image'
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
        <Input
          type='file'
          inputProps={{ accept: 'image/*' }}
          onChange={event => handleProductImages(event)}
          multiple
          capture
        />
        <CardActions sx={{ justifyContent: 'end' }}>
          <Button variant='contained' onClick={() => uploadMore()}>
            Upload More
          </Button>
          <Button type='reset' color='secondary' variant='tonal' onClick={cancelOperation}>
            Cancel
          </Button>
        </CardActions>
      </Card>

      <Card sx={{ mt: 5 }}>
        <CardHeader title='Edit Product' />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button type='button' variant='contained' disabled={activeResponse === 0} onClick={() => onPrev()}>
              Prev
            </Button>
            <Button type='button' variant='contained' disabled={activeResponse === 4} onClick={() => onNext()}>
              Next
            </Button>
          </Box>
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
                      {[...new Set(categories)].map((category, i) => {
                        return (
                          <MenuItem key={`cat-${i}`} value={category}>
                            {category}
                          </MenuItem>
                        )
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
                Save
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
