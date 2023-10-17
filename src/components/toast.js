import toast from "react-hot-toast";

const showSuccessMessage = (message) => {
    toast.remove()
    return toast.success(message, {
        position:'top-center'
    })
}

const showErrorMessage = message => {
  toast.remove()
  return toast.error(message, {
    position: 'top-center'
  })
}

const showWarningMessage = message => {
  toast.remove()

  return toast.error(message, {
    position: 'top-center',
    style: {
      zIndex: 9999 // Set a high z-index value
    },
    icon: '⚠️'
  })
}

export { showErrorMessage, showSuccessMessage, showWarningMessage }
