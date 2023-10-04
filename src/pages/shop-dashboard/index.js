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
  showErrorMessage
} from '../../components'
import { useEffect, useState } from 'react'
import { Network, Url } from 'src/configs'
import { useLoader } from 'src/hooks'

const ShopDashboard = () => {
  const { setLoader } = useLoader()
  const [shopStats, setShopStats] = useState([])
  const [orderRequest, setOrderRequests] = useState([])

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

  useEffect(() => {
    getStats()
    getOrderRequests()
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
            <OrderRequestTable orderRequest={orderRequest} />
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
