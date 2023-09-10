// ** React Imports
import { useRef, useState, Fragment } from 'react'

// ** MUI Imports
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import ButtonGroup from '@mui/material/ButtonGroup'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const options = ['Product', 'Service']

const ButtonGroupSplit = ({ shopId }) => {
  // ** States
  const [open, setOpen] = useState(false)

  const router = useRouter()

  // ** Ref
  const anchorRef = useRef(null)

  const handleMenuItemClick = option => {
    if (option == 'Product') {
      return router.push(`/products-and-services/ProductForm?shopId=${shopId}`)
    }
    router.push(`/products-and-services/ServiceForm?shopId=${shopId}`)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Fragment>
      <ButtonGroup variant='contained' ref={anchorRef} aria-label='split button'>
        <Button>Add</Button>
        <Button
          sx={{ px: '0' }}
          aria-haspopup='menu'
          onClick={handleToggle}
          aria-label='select merge strategy'
          aria-expanded={open ? 'true' : undefined}
          aria-controls={open ? 'split-button-menu' : undefined}
        >
          <Icon icon='tabler:chevron-down' />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu'>
                  {options.map((option, index) => (
                    <MenuItem key={option} disabled={index === 2} onClick={event => handleMenuItemClick(option)}>
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  )
}

export default ButtonGroupSplit
