import { Card, CardMedia, Typography, CardContent, Button, Divider, IconButton } from '@mui/material'
import { useState } from 'react'
import OrderRequestModal from '../modals/OrderRequestModal'
import Icon from 'src/@core/components/icon'

const CustomerProductCard = ({ product, handleFavourite }) => {
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
            alt='product'
          />
        </div>
        <CardContent sx={{ p: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              <b>{product?.name}</b>
            </Typography>
            {product?.is_favorite ? (
              <IconButton size='small' onClick={() => handleFavourite(product?.id, false, 'product')}>
                <Icon fontSize='1.5rem' icon='tabler:heart-filled' color='red' />
              </IconButton>
            ) : (
              <IconButton size='small' onClick={() => handleFavourite(product?.id, true, 'product')}>
                <Icon fontSize='1.5rem' icon='tabler:heart' />
              </IconButton>
            )}
          </div>
          <Typography
            sx={{
              color: 'text.secondary',
              height: '79px',
              overflow: 'auto',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                width: '0'
              }
            }}
            variant='body2'
          >
            {product?.description}
          </Typography>

          <Divider
            sx={{
              mt: theme => `${theme.spacing(0.5)} !important`,
              mb: theme => `${theme.spacing(2)} !important`
            }}
          />

          <Typography sx={{ mb: 2 }} color={'text.secondary'}>
            <b>{product?.stock_quantity} </b>stock items
          </Typography>

          <Typography sx={{ mb: 3 }}>
            <b>Category: </b>
            {product?.category_name}
          </Typography>

          {product?.price < 2 ? (
            ''
          ) : (
            <Typography>
              <b>Rs. </b>
              {product?.price?.toLocaleString()}
            </Typography>
          )}
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
