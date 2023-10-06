import {
  Card,
  Grid,
  CardContent,
  CardActions,
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton,
  styled,
  Button
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useState } from 'react'
import { useRouter } from 'next/router'

const ProductCard = ({ product, deleteProduct, shopId, id }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const router = useRouter()

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(false)
  }

  const handleEdit = () => {
    router.push(`/shop/products-and-services/EditProduct?productId=${id}&shopId=${shopId}`)
  }

  const StyledGrid = styled(Grid)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    [theme.breakpoints.up('md')]: {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  }))

  return (
    <Card sx={{ mt: 5, height: '300px' }} key={product?.id}>
      <Grid container spacing={6} sx={{ p: 0 }}>
        <StyledGrid item md={6} xs={12} sx={{ p: 0 }}>
          <div style={{ height: '300px' }}>
            <img
              style={{ height: '100%', objectFit: 'contain', width: '100%' }}
              alt='Apple iPhone 11 Pro'
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product?.images[0]?.path}`}
            />
          </div>
        </StyledGrid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            pt: ['0 !important', '0 !important', '1.5rem !important'],
            pl: ['1.5rem !important', '1.5rem !important', '0 !important']
          }}
        >
          <CardContent>
            <Typography variant='h5' sx={{ mb: 2 }}>
              {product?.name}
            </Typography>
            <Typography sx={{ mb: 3.5, color: 'text.secondary', height: '100px', overflow: 'hidden' }}>
              {product?.description}
            </Typography>
            <Typography sx={{ fontWeight: 500, mb: 3 }}>
              Price:{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                Rs{product?.price}
              </Box>
            </Typography>
            <Typography sx={{ fontWeight: 500, mb: 3 }}>
              Category:{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {product?.category_name}
              </Box>
            </Typography>
          </CardContent>
          <CardActions className='card-action-dense'>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <Button sx={{ '& svg': { mr: 2 } }}>
                <Icon icon='tabler:eye' fontSize={20} />
                Show Details
              </Button>
              <IconButton
                id='long-button'
                aria-label='share'
                aria-haspopup='true'
                onClick={handleClick}
                aria-controls='long-menu'
                aria-expanded={open ? 'true' : undefined}
              >
                <Icon icon='tabler:dots-vertical' fontSize={20} />
              </IconButton>

              <Menu
                open={open}
                id={product.id}
                anchorEl={anchorEl}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'long-button'
                }}
              >
                <MenuItem value={product} onClick={() => deleteProduct(id)}>
                  <Icon icon='tabler:trash' />
                </MenuItem>
                <MenuItem value={product} onClick={handleEdit}>
                  <Icon icon='tabler:pencil' />
                </MenuItem>
              </Menu>
            </Box>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  )
}

export default ProductCard
