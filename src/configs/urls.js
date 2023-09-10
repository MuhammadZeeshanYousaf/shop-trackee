export default {
  getUser: '/users/tokens/info',
  updateUser: '/user',
  getShops: '/shops',
  uploadImages: shopId => `/shops/${shopId}/products/images`,
  deleteProductImage: (shopId, productId, imageId) => `/shops/${shopId}/products/${productId}/images/${imageId}`,
  recognizeProductImages: (shopId, productId, imageId) =>
    `/shops/${shopId}/products/${productId}/images/${imageId}/recognize`,
  newProduct: shopId => `/shops/${shopId}/products/new`,

  createProduct: (shopId, productId) => `/shops/${shopId}/products/${productId}`,

  getProducts: shopId => `/shops/${shopId}/products`,

  deleteProduct: (shopId, productId) => `/shops/${shopId}/products/${productId}`,

  newService: shopId => `/shops/${shopId}/services/new`,

  uploadServiceImages: shopId => `/shops/${shopId}/services/images`,

  deleteServiceImage: (shopId, serviceId, imageId) => `/shops/${shopId}/services/${serviceId}/images/${imageId}`,

  recognizeServiceImages: (shopId, serviceId, imageId) =>
    `/shops/${shopId}/services/${serviceId}/images/${imageId}/recognize`,

  getServices: shopId => `/shops/${shopId}/services`
}
