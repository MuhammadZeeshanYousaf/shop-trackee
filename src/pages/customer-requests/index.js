import { useEffect, useState } from 'react'
import { Network, Url } from 'src/configs'
import { useCoordinates, useLoader } from 'src/hooks'
import { DataGrid } from '@mui/x-data-grid'
import useBgColor from 'src/@core/hooks/useBgColor'
import { Typography, Button, Card, CardHeader, Box, Chip, Tooltip } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { showErrorMessage, showSuccessMessage, MapModal } from 'src/components'
import Icon from 'src/@core/components/icon'

const OrderRequest = () => {
  const { setLoader } = useLoader()
  const { longitude, latitude } = useCoordinates()
  const [open, setOpen] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [currentPage, setCurrentpage] = useState(0)

  const handleClose = () => setOpen(false)
  const [destination, setDestination] = useState({
    longitude: '',
    latitude: ''
  })

  const origin = {
    latitude,
    longitude
  }

  const [orderRequest, setOrderRequest] = useState([])

  const getOrderRequests = async () => {
    setLoader(true)
    const response = await Network.get(Url.getShopOrderRequests(currentPage))
    setLoader(false)
    setOrderRequest(response.data.order_requests)
    setTotalRecords(response.data.meta.total_count)
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
  }, [currentPage])

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
        return (
          <Tooltip placement='top' title={row?.message}>
            <Box sx={{ textOverflow: 'inherit' }}>{row?.message}</Box>
          </Tooltip>
        )
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
      flex: 0.1,
      minWidth: 200,
      headerName: 'Location',
      field: 'shop_direction',
      renderCell: params => {
        const { row } = params
        return (
          <Button
            onClick={() => {
              setDestination({ latitude: row?.shop?.latitude, longitude: row?.shop?.longitude })
              setOpen(true)
            }}
          >
            Get Direction
          </Button>
        )
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
    <>
      <MapModal key={open} open={open} handleClose={handleClose} destination={destination} origin={origin} />
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <CardHeader title='Order Requests' />
          <Icon onClick={() => getOrderRequests()} style={{ marginRight: '10px' }} icon='tabler:refresh' />
        </div>

        <Box sx={{ height: 500 }}>
          <DataGrid
            pagination
            paginationMode='server'
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8
                }
              }
            }}
            onPaginationModelChange={({ page }) => setCurrentpage(page + 1)}
            rowCount={totalRecords}
            columns={columns}
            rows={orderRequest}
            disableColumnMenu
          />
        </Box>
      </Card>
    </>
  )
}

OrderRequest.acl = {
  subject: 'order-request',
  action: 'read'
}

export default OrderRequest
