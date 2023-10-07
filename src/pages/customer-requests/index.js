import { useEffect, useState } from 'react'
import { Network, Url } from 'src/configs'
import { useLoader } from 'src/hooks'
import { DataGrid } from '@mui/x-data-grid'
import useBgColor from 'src/@core/hooks/useBgColor'
import { Typography, Button, Card, CardHeader, Box, Chip } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { showErrorMessage, showSuccessMessage } from 'src/components'

const OrderRequest = () => {
  const { setLoader } = useLoader()

  const [orderRequest, setOrderRequest] = useState([])

  const getOrderRequests = async () => {
    setLoader(true)
    const response = await Network.get(Url.getShopOrderRequests)
    setLoader(false)
    setOrderRequest(response.data)
  }

  const cancelRequest = async orderId => {
    setLoader(true)
    const response = await Network.delete(Url.cancelRequestCustomer(orderId))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)

    const filterRequest = orderRequest.filter(obj => obj.id != orderId)

    setOrderRequest(filterRequest)
  }

  const removeRequest = async orderId => {
    setLoader(true)
    const response = await Network.delete(Url.removeRequestCustomer(orderId))
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    const filterRequest = orderRequest.filter(obj => obj.id != orderId)
    setOrderRequest(filterRequest)
  }

  useEffect(() => {
    getOrderRequests()
  }, [])

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
      flex: 0.15,
      minWidth: 100,
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
        return <Box>{row?.created_at}</Box>
      }
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
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {row?.status == 'pending' ? (
              <Button variant='contained' color='error' onClick={() => cancelRequest(row?.id)}>
                Cancel
              </Button>
            ) : (
              <Button variant='outlined' color='error' onClick={() => removeRequest(row?.id)}>
                Remove
              </Button>
            )}
          </Box>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader title='Order Requests' />
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={orderRequest} disableColumnMenu />
      </Box>
    </Card>
  )
}

OrderRequest.acl = {
  subject: 'order-request',
  action: 'read'
}

export default OrderRequest
