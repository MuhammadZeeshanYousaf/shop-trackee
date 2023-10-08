import { Card, CardMedia, Typography, CardContent, Button } from '@mui/material'
import { useState } from 'react'
import OrderRequestModal from '../modals/OrderRequestModal'
import Icon from 'src/@core/components/icon'

const CustomerProductCard = ({ product }) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)

  return (
    <>
      <OrderRequestModal orderableType='product' orderableId={product?.id} open={open} handleClose={handleClose} />
      <Card>
        <div style={{ height: '200px', marginTop: '5px' }}>
          <img
            style={{ height: '100%', width: '100%', objectFit: 'contain' }}
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product?.images[0]?.path}`}
          />
        </div>
        <CardContent sx={{ p: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              {product?.name}
            </Typography>
            <Icon fontSize='1.5rem' icon='tabler:heart' color='red' />
          </div>

          <Typography sx={{ mb: 2 }}>Rs{product?.price}</Typography>
          <Typography sx={{ height: '100px' }} variant='body2'>
            {product?.description}
          </Typography>
        </CardContent>
        <Button
          onClick={() => setOpen(true)}
          variant='contained'
          sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          Request Order
        </Button>
      </Card>
    </>
  )
}

export default CustomerProductCard
