import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { showErrorMessage } from 'src/components'
import { Network, Url } from 'src/configs'
import { useLoader } from 'src/hooks'
import { Grid } from '@mui/material'
import ProductCard from '../shop/products-and-services/ProductCard'

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
    <Grid container>
      {products?.map((product, i) => (
        <Grid xs={12} lg={6} item>
          <ProductCard key={product?.id} id={product?.id} product={product} deleteProduct={() => {}} shopId={1} />
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
