import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { showErrorMessage, showSuccessMessage } from 'src/components'
import { Network, Url } from 'src/configs'
import { useLoader } from 'src/hooks'
import { Grid, Typography, Pagination } from '@mui/material'
import ServiceCard from '../shop/products-and-services/ServiceCard'
import ShopCard from '../shop/ShopCard'

const FetchServices = () => {
  const router = useRouter()
  const { setLoader } = useLoader()
  const [services, setServices] = useState([])
  const [shops, setShops] = useState([])

  const { longitude, latitude, distance, service_page } = router.query
  const [totalPages, setTotalPages] = useState(0)

  const [currentPage, setCurrentPage] = useState(service_page)

  const getServiceData = async () => {
    setLoader(true)
    const response = await Network.get(Url.viewAllServices(latitude, longitude, distance, currentPage))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setServices(response.data.service.data)
    setShops(response.data.shop.data)
    setTotalPages(response.data.service.total_pages)
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
    getServiceData()
  }

  useEffect(() => {
    getServiceData()
  }, [currentPage])

  const handleChange = (event, value) => {
    setCurrentPage(value)
  }

  return (
    <>
      <Grid container spacing={5}>
        {services?.map((service, i) => (
          <Grid xs={12} lg={6} item>
            <ServiceCard
              service={service}
              key={i}
              handleFavourite={addToFavourite}
              deleteService={() => {}}
              shopId={1}
            />
          </Grid>
        ))}
      </Grid>

      {/* Service Pagination */}
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

FetchServices.acl = {
  action: 'read',
  subject: 'fetch-services'
}

export default FetchServices
