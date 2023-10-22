import { Box, Grid, MenuItem, Select, FormControl, InputLabel, Pagination, Button } from '@mui/material'
import SplitButton from './SplitButton'
import { useRouter } from 'next/router'
import { useLoader } from 'src/hooks'
import { Url, Network } from '../../../configs'
import { showErrorMessage, showSuccessMessage } from 'src/components'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import ServiceCard from './ServiceCard'
import Icon from 'src/@core/components/icon'

const ProductandServices = () => {
  const { query, push } = useRouter()
  const { setLoader } = useLoader()
  const [currentProductPage, setCurrentProductPage] = useState(1)
  const [totalProductpages, setTotalProductpages] = useState(1)
  const [products, setProducts] = useState([])

  const [currentServicePage, setCurrentServicepage] = useState(1)
  const [totalServicepages, setTotalServicePages] = useState(1)
  const [services, setServices] = useState([])
  const [mode, setMode] = useState('Both')

  const getProducts = async () => {
    setLoader(true)
    const response = await Network.get(Url.getProducts(query.shopId, currentProductPage))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setProducts(response.data.products)
    setTotalProductpages(response.data.meta.total_pages)
  }

  const getServices = async () => {
    setLoader(true)
    const response = await Network.get(Url.getServices(query.shopId, currentServicePage))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setServices(response.data.services)
    setTotalServicePages(response.data.meta.total_pages)
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
  }, [currentProductPage])

  useEffect(() => {
    getServices()
  }, [currentServicePage])

  const handleProductPage = (event, value) => {
    setCurrentProductPage(value)
  }

  const handleServicePage = (event, value) => {
    setCurrentServicepage(value)
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={() => push('/shop')} variant='outlined' startIcon={<Icon icon='tabler:arrow-narrow-left' />}>
          Back
        </Button>
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

      <Grid container spacing={5}>
        {/* Products */}
        {mode == 'Both' || mode == 'Products' ? (
          <Grid item md={6}>
            <h3>Products</h3>
            {products?.map((product, i) => {
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
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Pagination count={totalProductpages} onChange={handleProductPage} />
            </div>
          </Grid>
        ) : null}
        {/* Services */}
        {mode == 'Both' || mode == 'Services' ? (
          <Grid item md={6}>
            <h3>Services</h3>
            {services?.map((service, i) => (
              <ServiceCard mode='shop' service={service} key={i} deleteService={deleteService} shopId={query?.shopId} />
            ))}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Pagination count={totalServicepages} onChange={handleServicePage} />
            </div>
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
