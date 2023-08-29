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

export {showErrorMessage,showSuccessMessage}