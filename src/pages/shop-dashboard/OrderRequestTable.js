import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

const columns = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: 'Item'
  },
  {
    flex: 0.25,
    minWidth: 200,
    field: 'full_name',
    headerName: 'Shop'
  },
  {
    flex: 0.25,
    minWidth: 230,
    field: 'email',
    headerName: 'Customer'
  },
  {
    flex: 0.15,
    type: 'date',
    minWidth: 130,
    headerName: 'Location',
    field: 'start_date',
    valueGetter: params => new Date(params.value)
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'Status',
    headerName: 'Status'
  },
  {
    flex: 0.1,
    field: 'age',
    minWidth: 80,
    headerName: 'Action'
  }
]

const OrderRequestTable = () => {
  return (
    <Card>
      <CardHeader title='Order Requests' />
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={[]} />
      </Box>
    </Card>
  )
}

export default OrderRequestTable
