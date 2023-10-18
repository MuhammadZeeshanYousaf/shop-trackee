import { useRouter } from 'next/router'
import { Network, Url } from '../../configs'
import { showErrorMessage, showSuccessMessage } from '../../components'
import { useLoader } from '../../hooks'
import { useEffect, useState } from 'react'
import { Grid, Box, Button, Pagination } from '@mui/material'
import ShopCard from './ShopCard'

const Shop = () => {
  const router = useRouter()
  const { setLoader } = useLoader()
  const [shops, setShops] = useState([])
  const [currentPage, setCurrentpage] = useState(1)
  const [totalpages, setTotalPages] = useState(1)

  const getShops = async () => {
    setLoader(true)
    const response = await Network.get(Url.shop(currentPage))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setTotalPages(response.data.meta.total_pages)
    setShops(response.data.shops)
  }

  useEffect(() => {
    getShops()
  }, [currentPage])

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'contact', label: 'Contact' },

    {
      id: 'Actiom',
      label: 'Action'
    }
  ]

  const deleteShop = async id => {
    setLoader(true)
    const response = await Network.delete(`${Url.getShops}/${id}`)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    getShops()
  }

  const handleChange = (event, value) => {
    setCurrentpage(value)
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button variant='contained' onClick={() => router.push('/shop/form?mode=Add')}>
          Create Shop
        </Button>
      </Box>
      <Grid container spacing={6} sx={{ marginTop: '5px' }}>
        {shops?.map(shop => {
          return <ShopCard key={shop.id} shop={shop} deleteShop={deleteShop} />
        })}
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination count={totalpages} onChange={handleChange} />
      </div>
    </div>
  )
}

Shop.acl = {
  action: 'read',
  subject: 'shop'
}

export default Shop
