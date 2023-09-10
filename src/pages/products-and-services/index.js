import { Box, Grid } from '@mui/material'
import SplitButton from './SplitButton'
import { useRouter } from 'next/router'
import { useLoader } from 'src/hooks'
import { Url, Network } from '../../configs'
import { showErrorMessage, showSuccessMessage } from 'src/components'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

const ProductandServices = () => {
  const { query } = useRouter()
  const { setLoader } = useLoader()
  const [product, setProducts] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)

  const getProducts = async () => {
    setLoader(true)
    const response = await Network.get(Url.getProducts(query.shopId))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    console.log({ response })

    setProducts(response.data)
  }

  const deleteProduct = async id => {
    setLoader(true)
    const response = await Network.delete(Url.deleteProduct(query.shopId, id))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    setAnchorEl(null)
    getProducts()
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <SplitButton shopId={query.shopId} />
      </Box>

      <Grid container>
        {/* Products */}
        <Grid item md={6}>
          {product?.map((product, i) => (
            <ProductCard
              key={i}
              product={product}
              deleteProduct={deleteProduct}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            />
          ))}
        </Grid>
        {/* Services */}
        <Grid item md={6}></Grid>
      </Grid>
    </>
  )
}

export default ProductandServices
