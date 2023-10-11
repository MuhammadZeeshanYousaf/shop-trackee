import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Grid } from '@mui/material'
import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'
import OrderRequestTable from './OrderRequestTable'
import {
  AnalyticsEarningReports,
  WelcomeCard,
  EcommerceStatistics,
  PopularProducts,
  showErrorMessage,
  showSuccessMessage
} from '../../components'
import { useEffect, useState } from 'react'
import { Network, Url } from 'src/configs'
import { useLoader, useCoordinates } from 'src/hooks'

const ShopDashboard = () => {
  const { setLoader } = useLoader()
  const [shopStats, setShopStats] = useState([])
  const [orderRequest, setOrderRequests] = useState([])
  const { setCoordinates } = useCoordinates()

  const getStats = async () => {
    setLoader(true)
    const response = await Network.get(Url.shopDashboard)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)

    setShopStats(response.data)
  }

  const getOrderRequests = async () => {
    setLoader(true)
    const response = await Network.get(Url.getShopOrderRequests)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)

    setOrderRequests(response.data)
  }

  const handleRequest = async (orderID, mode) => {
    setLoader(true)
    const response = await Network.patch(Url.acceptAndrejectRequest(orderID, mode))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)

    getOrderRequests()
  }

  const removeRequest = async orderID => {
    setLoader(true)
    const response = await Network.delete(Url.removeRequestbySeller(orderID))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage('Successfully Deleted Request')

    const filterRequest = orderRequest.filter(request => request.id != orderID)

    setOrderRequests(filterRequest)
  }

  useEffect(() => {
    getStats()
    getOrderRequests()
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setLoader(true)
          setCoordinates(position?.coords?.longitude, position?.coords?.latitude)
          setLoader(false)
        },
        error => {
          showErrorMessage('Error in getting live location')
        }
      ),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
    } else {
      showErrorMessage('It is better to select location')
    }
  }, [])

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <WelcomeCard />
          </Grid>
          <Grid item xs={12} md={8}>
            {/* <AnalyticsEarningReports /> */}
            <EcommerceStatistics shopStats={shopStats} />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <OrderRequestTable
              removeRequest={removeRequest}
              handleRequest={handleRequest}
              orderRequest={orderRequest}
              getOrderRequest={getOrderRequests}
            />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

ShopDashboard.acl = {
  subject: 'shop-dashboard',
  action: 'read'
}

export default ShopDashboard
