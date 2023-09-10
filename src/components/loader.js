import Lottie from 'lottie-react'

import { LoaderAnimation } from '../assets/animations'

const Loader = ({ visible }) => {
    if(!visible) return null
  return (
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent:'center',alignItems:'center',position:'fixed',opacity:'75%',background:'white',zIndex:9999}}>
      <Lottie animationData={LoaderAnimation} loop={true} />
    </div>
  )
}

export default Loader
