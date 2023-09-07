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
        {/* <Grid item xs={12}>
          <Card>
            <CardHeader title='Shops' />
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shops?.map(shop => {
                    return (
                      <TableRow>
                        <TableCell>{shop?.name}</TableCell>
                        <TableCell>{shop?.contact}</TableCell>
                        <TableCell>
                          <Icon icon='tabler:trash' fontSize={20} onClick={() => deleteShop(shop.id)} />
                          <Icon
                            icon='tabler:pencil'
                            fontSize={20}
                            onClick={() => router.push(`/shop/form?mode=Edit&id=${shop.id}`)}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
</Grid> */}

        {shops?.map(shop => {
          return <ShopCard shop={shop} deleteShop={deleteShop} />
        })}
      </Grid>
    </div>
  )
}

export default Shop
