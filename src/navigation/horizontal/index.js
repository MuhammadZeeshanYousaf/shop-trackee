const navigation = () => [
  {
    title: 'Home',
    path: '/home',
    icon: 'tabler:smart-home'
  },
  {
    title: 'Shops',
    path: '/shop',
    icon: 'tabler:building-warehouse',
    action: 'read',
    subject: 'shop'
  },
  {
    title: 'Listing',
    path: '/listing',
    icon: 'tabler:building-warehouse',
    action: 'read',
    subject: 'listing'
  },
  {
    path: '/acl',
    action: 'read',
    subject: 'acl-page',
    title: 'Access Control',
    icon: 'tabler:shield'
  }
]

export default navigation
