import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { TextField } from '@mui/material'
import { Network, Url, multipartConfig } from 'src/configs'
import { useLoader } from 'src/hooks'
import { showErrorMessage, showSuccessMessage } from '../toast'
import { useTheme } from '@mui/material'

const OrderRequestModal = ({ open, handleClose, orderableType, orderableId }) => {
  const { setLoader } = useLoader()
  const [message, setMessage] = React.useState('')
  const theme = useTheme()

  const style = theme => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.down('md')]: {
      width: 300
    },
    [theme.breakpoints.up('md')]: {
      width: 400
    },

    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
  })

  const createRequest = async () => {
    setLoader(true)

    const response = await Network.post(Url.createOrderRequest, {
      orderable_id: orderableId,
      orderable_type: orderableType,
      message
    })
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    handleClose()
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Create Order Request
          </Typography>
          <TextField
            type='text'
            value={message}
            onChange={e => setMessage(e.target.value)}
            fullWidth
            sx={{ mt: 5 }}
            label='Message'
            variant='outlined'
          />
          <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 5 }}>
            <Button color='secondary' size='small' variant='contained' onClick={handleClose}>
              Cancel
            </Button>
            <Button sx={{ ml: 2 }} size='small' variant='contained' onClick={() => createRequest()}>
              Confirm Request
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default OrderRequestModal
