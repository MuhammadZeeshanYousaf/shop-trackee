import { useContext } from 'react'
import { CoodinateContext } from '../context'

const useCoordinates = () => {
  const { latitude, setLatitude, setLongitude, longitude } = useContext(CoodinateContext)

  const setCoordinates = (longitude, latitude) => {
    setLongitude(longitude)
    setLatitude(latitude)
  }

  return { setCoordinates, latitude, longitude }
}

export default useCoordinates
