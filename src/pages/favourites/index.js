import { useEffect, useState } from 'react'
import { Network, Url } from 'src/configs'
import { useLoader } from 'src/hooks'
import { CustomerProductCard, showErrorMessage, showSuccessMessage } from 'src/components'
import { Grid } from '@mui/material'
import ServiceCard from '../shop/products-and-services/ServiceCard'

const Favourites = () => {
  const { setLoader } = useLoader()
  const [favourites, setFavourites] = useState([])
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])

  const filterData = data => {
    const serviceArray = []
    const productArray = []

    data.forEach(item => {
      if (item.favoritable_type === 'Product') {
        productArray.push(item)
      } else {
        serviceArray.push(item)
      }
    })

    return { service: serviceArray, product: productArray }
  }

  const getFavourites = async () => {
    setLoader(true)
    const response = await Network.get(Url.addToFavourite)
    setLoader(false)
    if (!response.ok) return showErrorMessage(response.data.message)

    const { service, product } = filterData(response.data)
    setProducts(product)
    setServices(service)
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
      <Grid item xs={12} sm={6} md={4} lg={6}>
        {products.map((product, i) => {
          return (
            <div style={{ marginTop: '20px' }}>
              {' '}
              <CustomerProductCard product={product.favoritable} key={i} handleFavourite={addToFavourite} />
            </div>
          )
        })}
      </Grid>

      <Grid xs={12} lg={6} item>
        {services.map((service, i) => {
          return (
            <ServiceCard
              key={i}
              handleFavourite={addToFavourite}
              deleteService={() => {}}
              shopId={1}
              service={service?.favoritable}
            />
          )
        })}
      </Grid>
    </Grid>
  )
}

Favourites.acl = {
  action: 'read',
  subject: 'favourite'
}

export default Favourites
