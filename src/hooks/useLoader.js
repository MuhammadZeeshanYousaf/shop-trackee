import { useContext } from 'react'
import {LoaderContext} from '../context'

const useLoader = () => {
   
    const {setLoading}=useContext(LoaderContext)
    

    const setLoader=(status)=>{
        setLoading(status)
    }
 
    return {setLoader}

}

export default useLoader