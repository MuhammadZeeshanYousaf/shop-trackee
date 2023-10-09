import { useEffect, useState } from 'react'
import { Network, Url } from 'src/configs'
import { useLoader } from 'src/hooks'
import { CustomerProductCard, showErrorMessage, showSuccessMessage } from 'src/components'
import { Grid } from '@mui/material'
import ServiceCard from '../shop/products-and-services/ServiceCard'

const Favourites = () => {
  const { setLoader } = useLoader()
  const [favourites, setFavourites] = useState([])

  const getFavourites = async () => {
    setLoader(true)
    const response = await Network.get(Url.addToFavourite)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    setFavourites(response.data)
  }

  const addToFavourite = async (id, status, type) => {
    const payload = {
      favoritable_id: id,
      favoritable_type: type,
      is_favorite: status
    }
    setLoader(true)
    const response = await Network.put(Url.addToFavourite, payload)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)
    showSuccessMessage(response.data.message)
    getFavourites()
  }

  useEffect(() => {
    getFavourites()
  }, [])

  return (
    <Grid container spacing={5}>
      {favourites?.map((favorite, i) => {
        return favorite?.favoritable_type == 'Product' ? (
          <Grid item xs={12} sm={6} md={4}>
            <CustomerProductCard product={favorite?.favoritable} key={i} handleFavourite={addToFavourite} />
          </Grid>
        ) : (
          <Grid xs={12} lg={6} item>
            <ServiceCard
              key={i}
              handleFavourite={addToFavourite}
              deleteService={() => {}}
              shopId={1}
              service={favorite?.favoritable}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}

Favourites.acl = {
  action: 'read',
  subject: 'favourite'
}

export default Favourites
