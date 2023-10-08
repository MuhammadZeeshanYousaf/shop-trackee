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

  customeDashboard: (distance, longitude, latitude) =>
    `/customer/home?distance=${distance}&latitude=${latitude}&longitude=${longitude}`,

  search: (q, distance, longitude, latitude) =>
    `/search?q=${q}&distance=${distance}&longitude=${longitude}&latitude=${latitude}`,

  searhWithImage: '/search',

  viewAllProducts: (latitude, longitude, distance, product_page) =>
    `/search_all?type=product&latitude=${latitude}&longitude=${longitude}&distance=${distance}&product_page=${product_page}`,

  viewAllServices: (latitude, longitude, distance, product_page) =>
    `/search_all?type=service&latitude=${latitude}&longitude=${longitude}&distance=${distance}&product_page=${product_page}`,

  // create order request

  createOrderRequest: '/customer/order_requests',

  // cancel request by customer

  cancelRequestCustomer: orderId => `/customer/order_requests/${orderId}`,

  //remove request by customer

  removeRequestCustomer: orderId => `/customer/order_requests/${orderId}/remove`,

  acceptAndrejectRequest: (orderID, mode) => `/seller/order_requests/${orderID}/${mode}`,

  removeRequestbySeller: orderId => `/seller/order_requests/${orderId}/remove`
}
