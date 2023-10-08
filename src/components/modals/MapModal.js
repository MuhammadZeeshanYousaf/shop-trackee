import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

import { useLoader } from 'src/hooks'

import { useTheme } from '@mui/material'
import GetDirectionMap from '../GetDirectionMap'

const MapModal = ({ open, handleClose, destination, origin }) => {
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

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <GetDirectionMap destination={destination} origin={origin} />
        </Box>
      </Modal>
    </div>
  )
}

export default MapModal
