import { Box, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import SplitButton from './SplitButton'
import { useRouter } from 'next/router'
import { useLoader } from 'src/hooks'
import { Url, Network } from '../../../configs'
import { showErrorMessage, showSuccessMessage } from 'src/components'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import ServiceCard from './ServiceCard'

const ProductandServices = () => {
  const { query } = useRouter()
  const { setLoader } = useLoader()
  const [products, setProducts] = useState([])

  const [services, setServices] = useState([])
  const [mode, setMode] = useState('Both')

  const getProducts = async () => {
    setLoader(true)
    const response = await Network.get(Url.getProducts(query.shopId))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setProducts(response.data.products)
  }

  const getServices = async () => {
    setLoader(true)
    const response = await Network.get(Url.getServices(query.shopId))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setServices(response.data.services)
    console.log({ response })
  }

  const deleteProduct = async id => {
    setLoader(true)
    const response = await Network.delete(Url.deleteProduct(query.shopId, id))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    getProducts()
  }

  const deleteService = async id => {
    setLoader(true)
    const response = await Network.delete(Url.deleteService(query.shopId, id))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    getServices()
  }

  useEffect(() => {
    getProducts()
    getServices()
  }, [])

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <SplitButton shopId={query.shopId} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <FormControl sx={{ width: '50%' }}>
          <InputLabel id='demo-simple-select-label'>Filter By</InputLabel>
          <Select label='Filter By' value={mode} onChange={e => setMode(e.target.value)}>
            <MenuItem value='Both'>Both</MenuItem>
            <MenuItem value='Products'>Products</MenuItem>
            <MenuItem value='Services'>Services</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid sx={{ mt: 5 }} container spacing={5}>
        {/* Products */}
        {mode == 'Both' || mode == 'Products' ? (
          <Grid item md={6}>
            {products?.map((product, i) => {
              console.log('product.id', product?.id)

              return (
                <ProductCard
                  key={product?.id}
                  id={product?.id}
                  product={product}
                  deleteProduct={deleteProduct}
                  shopId={query?.shopId}
                />
              )
            })}
          </Grid>
        ) : null}
        {/* Services */}
        {mode == 'Both' || mode == 'Services' ? (
          <Grid item md={6}>
            {services?.map((service, i) => (
              <ServiceCard mode='shop' service={service} key={i} deleteService={deleteService} shopId={query?.shopId} />
            ))}
          </Grid>
        ) : null}
      </Grid>
    </>
  )
}

ProductandServices.acl = {
  subject: 'products-and-services',
  action: 'read'
}

export default ProductandServices
