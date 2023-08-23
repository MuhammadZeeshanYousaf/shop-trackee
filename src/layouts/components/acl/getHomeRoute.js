/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'seller') return '/acl'
  else if (role === 'customer') return '/home'
}

export default getHomeRoute
