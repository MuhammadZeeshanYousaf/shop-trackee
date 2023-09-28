import { DataGrid } from '@mui/x-data-grid'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Typography, Button, Card, CardHeader, Box, Chip } from '@mui/material'
import useBgColor from 'src/@core/hooks/useBgColor'
import dayjs from 'dayjs'

const OrderRequestTable = ({ orderRequest }) => {
  const bgColors = useBgColor()

  const colors = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: { ...bgColors.errorLight },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight }
  }

  const columns = [
    {
      flex: 0.25,
      minWidth: 290,
      field: 'name',
      headerName: 'Item',
      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${row?.orderable?.images[0]?.path}`}
              sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row?.orderable?.name}
              </Typography>
              <Typography noWrap variant='caption'>
                {row?.orderable_type}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'shop_name',
      headerName: 'Shop',
      renderCell: params => {
        const { row } = params
        return <Box>{row?.shop?.name}</Box>
      }
    },
    {
      flex: 0.15,
      minWidth: 110,
      field: 'customer_name',
      headerName: 'Customer',
      renderCell: params => {
        const { row } = params
        return <Box>{row?.customer?.name}</Box>
      }
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'message',
      headerName: 'Message',
      renderCell: params => {
        const { row } = params
        return <Box sx={{ textOverflow: 'inherit' }}>{row?.message}</Box>
      }
    },
    {
      flex: 0.15,
      minWidth: 110,
      field: 'created_at',
      headerName: 'Created At',
      renderCell: params => {
        const { row } = params
        return <Box>{dayjs(row?.created_at).format('DD-MM-YY')}</Box>
      }
    },
    {
      flex: 0.15,
      minWidth: 130,
      headerName: 'Location',
      field: 'shop_direction'
    },
    {
      flex: 0.125,
      minWidth: 120,
      field: 'Status',
      headerName: 'Status',
      renderCell: params => {
        const { row } = params
        return (
          <Chip
            rounded
            size='small'
            skin='light'
            label={row?.status}
            sx={{
              '& .MuiChip-label': { textTransform: 'capitalize' },
              color:
                row?.status == 'pending' ? colors.warning : row?.status == 'rejected' ? colors.error : colors.success
            }}
          />
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'actions',
      headerName: 'Actions',
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button size='small' variant='outlined' color='secondary' sx={{ mr: 5 }}>
              Accept
            </Button>
            <Button size='small' variant='outlined' color='secondary'>
              Reject
            </Button>
          </Box>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader title='Order Requests' />
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={orderRequest} />
      </Box>
    </Card>
  )
}

export default OrderRequestTable
