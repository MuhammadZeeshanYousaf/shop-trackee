/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'customer') return '/customer-dashboard'
  else if (role === 'seller') return '/shop-dashboard'
}

export default getHomeRoute
