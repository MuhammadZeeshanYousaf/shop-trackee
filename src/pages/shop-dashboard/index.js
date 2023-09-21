import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Grid } from '@mui/material'
import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'
import { AnalyticsEarningReports, WelcomeCard, EcommerceStatistics, PopularProducts } from '../../components'

const ShopDashboard = () => {
  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            {/* <CardStatsWithAreaChart
              stats='97.5k'
              chartColor='success'
              avatarColor='success'
              title='Revenue Generated'
              avatarIcon='tabler:credit-card'
              chartSeries={[{ data: [6, 35, 25, 61, 32, 84, 70] }]}
            /> */}
            <WelcomeCard />
          </Grid>
          <Grid item xs={12} md={8}>
            {/* <AnalyticsEarningReports /> */}
            <EcommerceStatistics />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PopularProducts />
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
