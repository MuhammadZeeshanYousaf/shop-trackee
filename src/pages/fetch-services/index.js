import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { showErrorMessage, showSuccessMessage } from 'src/components'
import { Network, Url } from 'src/configs'
import { useLoader } from 'src/hooks'
import { Grid } from '@mui/material'
import ServiceCard from '../shop/products-and-services/ServiceCard'

const FetchServices = () => {
  const router = useRouter()
  const { setLoader } = useLoader()
  const [services, setServices] = useState([])

  const { longitude, latitude, distance, product_page } = router.query

  const getServiceData = async () => {
    setLoader(true)
    const response = await Network.get(Url.viewAllServices(latitude, longitude, distance, product_page))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setServices(response.data.service.data)
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
  }, [])

  return (
    <Grid container spacing={5}>
      {services?.map((service, i) => (
        <Grid xs={12} lg={6} item>
          <ServiceCard service={service} key={i} handleFavourite={addToFavourite} deleteService={() => {}} shopId={1} />
        </Grid>
      ))}
    </Grid>
  )
}

FetchServices.acl = {
  action: 'read',
  subject: 'fetch-services'
}

export default FetchServices
