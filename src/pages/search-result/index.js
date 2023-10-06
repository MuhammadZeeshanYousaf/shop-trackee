import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Network, Url, multipartConfig } from 'src/configs'
import { useLoader } from 'src/hooks'
import ProductCard from '../shop/products-and-services/ProductCard'
import ServiceCard from '../shop/products-and-services/ServiceCard'

const SearchResult = () => {
  const router = useRouter()
  const { q, distance, longitude, latitude, method } = router.query

  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])

  const { setLoader } = useLoader()
  const getData = async () => {
    setLoader(true)
    const response = await Network.get(Url.search(q, distance, longitude, latitude))
    setLoader(false)
    setProducts(response.data.products)
    setServices(response.data.services)
  }

  const getImageSearchData = async () => {
    const payload = {
      q,
      distance,
      longitude,
      latitude
    }
    setLoader(true)
    const response = await Network.post(Url.searhWithImage, payload)
    setLoader(false)
    setProducts(response.data.products)
    setServices(response.data.services)
  }

  useEffect(() => {
    if (method == 'get') getData()
    if (method == 'post') getImageSearchData()
  }, [])

  return (
    <div>
      <Typography variant='h4'>Products</Typography>
      <Grid container spacing={5}>
        {products?.map((product, i) => (
          <Grid xs={12} lg={6} item>
            <ProductCard key={product?.id} id={product?.id} product={product} deleteProduct={() => {}} shopId={1} />
          </Grid>
        ))}
      </Grid>
      <Typography sx={{ mt: 5 }} variant='h4'>
        Services
      </Typography>
      <Grid container spacing={5}>
        {services?.map((service, i) => (
          <Grid xs={12} lg={6} item>
            <ServiceCard service={service} key={i} deleteService={() => {}} shopId={1} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

SearchResult.acl = {
  subject: 'search-result',
  action: 'read'
}

export default SearchResult
