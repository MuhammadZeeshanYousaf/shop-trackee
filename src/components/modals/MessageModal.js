import { Modal, Box, Typography, Divider } from '@mui/material'

const MessageModal = ({ open, handleClose, message }) => {
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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h5' component='h2'>
          Message
        </Typography>
        <Divider sx={{ my: '0 !important' }} />
        <Typography sx={{ marginTop: 2 }}>{message}</Typography>
      </Box>
    </Modal>
  )
}

export default MessageModal
