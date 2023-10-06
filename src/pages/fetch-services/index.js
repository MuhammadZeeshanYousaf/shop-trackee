import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { showErrorMessage } from 'src/components'
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
    const response = await Network.get(Url.viewAllServices(longitude, latitude, distance, product_page))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setServices(response.data.service.data)
  }

  useEffect(() => {
    getServiceData()
  }, [])

  return (
    <Grid container>
      {services?.map((service, i) => (
        <Grid xs={12} lg={6} item>
          <ServiceCard service={service} key={i} deleteService={() => {}} shopId={1} />
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
