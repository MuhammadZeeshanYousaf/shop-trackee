import Lottie from 'lottie-react'

import { LoaderAnimation } from '../assets/animations'

const Loader = ({ visible }) => {
  if (!visible) return null

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        opacity: '65%',
        zIndex: 9999
      }}
    >
      <img src={'/images/preloader.gif'} alt='Loading...' width={80} height={80} />
    </div>
  )
}

export default Loader
