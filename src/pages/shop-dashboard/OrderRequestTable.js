import { DataGrid } from '@mui/x-data-grid'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Typography, Button, Card, CardHeader, Box, Chip, Tooltip, IconButton } from '@mui/material'
import useBgColor from 'src/@core/hooks/useBgColor'
import { MapModal } from 'src/components'
import Icon from 'src/@core/components/icon'

import { useState } from 'react'

const OrderRequestTable = ({
  orderRequest,
  handleRequest,
  removeRequest,
  getOrderRequest,
  totalRecords,
  setCurrentPage
}) => {
  const bgColors = useBgColor()

  const [destination, setDestination] = useState({
    longitude: '',
    latitude: ''
  })

  const [origin, setOrigin] = useState({
    latitude: '',
    longitude: ''
  })

  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)

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
      // flex: 0.1,
      // minWidth: 140,
      // maxWidth: 140,
      width: 200,
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
      // flex: 0.1,
      width: 200,

      // minWidth: 100,
      // maxWidth: 100,
      field: 'shop_name',
      headerName: 'Shop',
      renderCell: params => {
        const { row } = params

        return <Box>{row?.shop?.name}</Box>
      }
    },
    {
      width: 200,
      field: 'customer_name',
      headerName: 'Customer',
      renderCell: params => {
        const { row } = params

        return <Box>{row?.customer?.name}</Box>
      }
    },
    {
      width: 200,
      field: 'message',
      headerName: 'Message',
      renderCell: params => {
        const { row } = params

        return (
          <Tooltip placeholder='top' title={row?.message}>
            <Box sx={{ textOverflow: 'inherit' }}>{row?.message}</Box>
          </Tooltip>
        )
      }
    },
    {
      width: 150,
      headerName: 'Location',
      field: 'shop_direction',
      renderCell: params => {
        const { row } = params

        return (
          <Button
            onClick={() => {
              setDestination({ latitude: row?.latitude, longitude: row?.longitude })
              setOrigin({ latitude: row?.shop?.latitude, longitude: row?.shop?.longitude })
              setOpen(true)
            }}
          >
            <Icon icon='tabler:navigation' fontSize={18} />
            &nbsp;Direction
          </Button>
        )
      }
    },
    {
      width: 150,
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
      width: 200,
      field: 'actions',
      headerName: 'Actions',
      renderCell: params => {
        const { row } = params

        return row.status == 'pending' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              size='small'
              variant='contained'
              onClick={() => handleRequest(row?.id, 'accept')}
              color='success'
              sx={{ mr: 3 }}
            >
              Accept
            </Button>
            <Button size='small' variant='contained' color='error' onClick={() => handleRequest(row?.id, 'reject')}>
              Reject
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', m: 'auto' }}>
            <Button size='small' variant='tonal' color='error' onClick={() => removeRequest(row?.id)}>
              Remove
            </Button>
          </Box>
        )
      }
    },
    {
      width: 150,
      field: 'created_at',
      headerName: 'Requested At',
      renderCell: params => {
        const { row } = params

        return <Box>{row?.created_at}</Box>
      }
    }
  ]

  return (
    <>
      <MapModal key={open} open={open} handleClose={handleClose} destination={destination} origin={origin} />
      <Card sx={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <CardHeader title='Order Requests' />
          <IconButton sx={{ mr: 1 }} size='large' onClick={getOrderRequest}>
            <Icon icon='tabler:refresh' />
          </IconButton>
        </div>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            pagination
            paginationMode='server'
            sx={{ m: 2 }}
            columns={columns}
            rows={orderRequest}
            disableColumnMenu
            rowCount={totalRecords}
            onPaginationModelChange={({ page }) => setCurrentPage(page + 1)}
          />
        </Box>
      </Card>
    </>
  )
}

export default OrderRequestTable
