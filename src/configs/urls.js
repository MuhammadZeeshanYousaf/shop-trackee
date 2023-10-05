export default {
  getUser: '/users/tokens/info',
  updateUser: '/user',
  getShops: '/shops',

  uploadImages: shopId => `/shops/${shopId}/products/images`,

  uploadMoreProductImages: () => ``,

  deleteProductImage: (shopId, productId, imageId) => `/shops/${shopId}/products/${productId}/images/${imageId}`,
  recognizeProductImages: (shopId, productId, imageId) =>
    `/shops/${shopId}/products/${productId}/images/${imageId}/recognize`,
  newProduct: shopId => `/shops/${shopId}/products/new`,

  createProduct: (shopId, productId) => `/shops/${shopId}/products/${productId}`,

  getProducts: shopId => `/shops/${shopId}/products`,

  getProduct: (shopId, productId) => `/shops/${shopId}/products/${productId}`,

  deleteProduct: (shopId, productId) => `/shops/${shopId}/products/${productId}`,

  newService: shopId => `/shops/${shopId}/services/new`,

  uploadServiceImages: shopId => `/shops/${shopId}/services/images`,

  deleteServiceImage: (shopId, serviceId, imageId) => `/shops/${shopId}/services/${serviceId}/images/${imageId}`,

  recognizeServiceImages: (shopId, serviceId, imageId) =>
    `/shops/${shopId}/services/${serviceId}/images/${imageId}/recognize`,

  getServices: shopId => `/shops/${shopId}/services`,

  deleteService: (shopId, serviceId) => `/shops/${shopId}/services/${serviceId}`,

  uploadProductMoreImages: (shopId, productId) => `/shops/${shopId}/products/${productId}/images`,

  createService: (shopId, serviceId) => `/shops/${shopId}/services/${serviceId}`,

  getService: (shopId, serviceId) => `/shops/${shopId}/services/${serviceId}`,

  uploadServicestMoreImages: (shopId, serviceId) => `/shops/${shopId}/services/${serviceId}/images`,

  // Shop Dashboard

  shopDashboard: '/seller/stats',

  //get order request for shop

  getShopOrderRequests: '/order_requests',

  //get all categories
  getAllCategories: type => `/categories?type=${type}`,

  customeDashboard: '/customer/home?distance=9720&latitude=48.85341&longitude=2.3488'
}
