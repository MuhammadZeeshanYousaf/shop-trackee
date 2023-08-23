/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'customer') return '/acl'
  else if (role === 'seller') return '/home'
}

export default getHomeRoute
