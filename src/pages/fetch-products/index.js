import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { showErrorMessage, CustomerProductCard, showSuccessMessage } from 'src/components'
import { Network, Url } from 'src/configs'
import { useLoader } from 'src/hooks'
import { Grid, Typography } from '@mui/material'
import ShopCard from '../shop/ShopCard'

const FetchProducts = () => {
  const router = useRouter()
  const { setLoader } = useLoader()
  const [products, setProducts] = useState([])
  const [shops, setShops] = useState([])

  const { longitude, latitude, distance, product_page } = router.query

  const getProductData = async () => {
    setLoader(true)
    const response = await Network.get(Url.viewAllProducts(latitude, longitude, distance, product_page))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setProducts(response.data.product.data)
    setShops(response.data.shop.data)
  }

  const addToFavourite = async (id, status, type) => {
    const payload = {
      favoritable_id: id,
      favoritable_type: type,
      is_favorite: status
    }
    setLoader(true)
    const response = await Network.put(Url.addToFavourite, payload)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    getProductData()
  }

  useEffect(() => {
    getProductData()
  }, [])

  return (
    <>
      <Grid container spacing={5}>
        {products?.map((product, i) => (
          <Grid item xs={12} sm={6} md={4}>
            <CustomerProductCard handleFavourite={addToFavourite} product={product} key={i} />
          </Grid>
        ))}
      </Grid>
      <Typography sx={{ mt: 5 }} variant='h2'>
        Shops
      </Typography>

      <Grid container spacing={6} sx={{ marginTop: '5px' }}>
        {shops?.map(shop => {
          return <ShopCard key={shop.id} shop={shop} role='customer' deleteShop={() => {}} />
        })}
      </Grid>
    </>
  )
}

FetchProducts.acl = {
  action: 'read',
  subject: 'fetch-products'
}

export default FetchProducts
