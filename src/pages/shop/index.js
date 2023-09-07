import { useRouter } from 'next/router'
import { Network, Url } from '../../configs'
import { showErrorMessage, showSuccessMessage } from '../../components'
import { useLoader } from '../../hooks'
import { useEffect, useState } from 'react'
import { Grid, Box, Button } from '@mui/material'
import ShopCard from './ShopCard'

const Shop = () => {
  const router = useRouter()
  const { setLoader } = useLoader()
  const [shops, setShops] = useState([])

  const getShops = async () => {
    setLoader(true)
    const response = await Network.get(Url.getShops)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setShops(response.data)
  }

  useEffect(() => {
    getShops()
  }, [])

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

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button variant='contained' onClick={() => router.push('/shop/form?mode=Add')}>
          Create Shop
        </Button>
      </Box>
      <Grid container spacing={6} sx={{ marginTop: '5px' }}>
        {shops?.map(shop => {
          return <ShopCard shop={shop} deleteShop={deleteShop} />
        })}
      </Grid>
    </div>
  )
}

export default Shop
