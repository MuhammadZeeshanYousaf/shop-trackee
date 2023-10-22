import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { showErrorMessage, CustomerProductCard, showSuccessMessage } from 'src/components'
import { Network, Url } from 'src/configs'
import { useLoader } from 'src/hooks'
import { Grid, Typography, Pagination, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import ShopCard from '../shop/ShopCard'

const FetchProducts = () => {
  const router = useRouter()
  const { setLoader } = useLoader()
  const [products, setProducts] = useState([])
  const [shops, setShops] = useState([])

  const [totalPages, setTotalPages] = useState(0)
  const [totalShopPages, setTotalShoppages] = useState(0)
  const { longitude, latitude, distance, product_page } = router.query

  const [currentPage, setCurrentPage] = useState(product_page)
  const [currentShopPage, setCurrentShopPage] = useState(1)

  const [priceOrder, setPriceOrder] = useState(null)

  const getProductData = async () => {
    setLoader(true)
    const response = await Network.get(
      Url.viewAllProducts(latitude, longitude, distance, currentPage, currentShopPage, priceOrder)
    )
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setProducts(response.data.product.data)
    setShops(response.data.shop.data)
    setTotalPages(response.data.product.total_pages)
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
  }, [currentPage, currentShopPage, priceOrder])
  const handleChange = (event, value) => {
    setCurrentPage(value)
  }

  const handleShopPages = (event, value) => {
    setCurrentShopPage(value)
  }

  return (
    <>
      <FormControl size='small'>
        <InputLabel id='invoice-status-select'>Sort By Price</InputLabel>
        <Select
          sx={{ pr: 4 }}
          value={priceOrder}
          label='Invoice Status'
          labelId='invoice-status-select'
          onChange={e => setPriceOrder(e.target.value)}
        >
          <MenuItem value='asc'>Low to High</MenuItem>
          <MenuItem value='desc'>High to Low</MenuItem>
        </Select>
      </FormControl>
      <Grid sx={{ mt: 5 }} container spacing={5}>
        {products?.map((product, i) => (
          <Grid item xs={12} sm={6} md={4}>
            <CustomerProductCard handleFavourite={addToFavourite} product={product} key={i} />
          </Grid>
        ))}
      </Grid>

      {/* Product pagination */}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Pagination count={totalPages} onChange={handleChange} />
      </div>

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
