import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { showErrorMessage, CustomerProductCard } from 'src/components'
import { Network, Url } from 'src/configs'
import { useLoader } from 'src/hooks'
import { Grid } from '@mui/material'

const FetchProducts = () => {
  const router = useRouter()
  const { setLoader } = useLoader()
  const [products, setProducts] = useState([])

  const { longitude, latitude, distance, product_page } = router.query

  const getProductData = async () => {
    setLoader(true)
    const response = await Network.get(Url.viewAllProducts(longitude, latitude, distance, product_page))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setProducts(response.data.product.data)
  }

  useEffect(() => {
    getProductData()
  }, [])

  return (
    <Grid container spacing={5}>
      {products?.map((product, i) => (
        <Grid item xs={12} sm={6} md={4}>
          <CustomerProductCard product={product} key={i} />
        </Grid>
      ))}
    </Grid>
  )
}

FetchProducts.acl = {
  action: 'read',
  subject: 'fetch-products'
}

export default FetchProducts
