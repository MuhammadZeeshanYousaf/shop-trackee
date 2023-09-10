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

  deleteProduct: (shopId, productId) => `/shops/${shopId}/products/${productId}`
}
