export default {
  getUser: '/users/tokens/info',
  updateUser: '/user',
  getShops: page => `/shops?page=${page}`,

  uploadImages: shopId => `/shops/${shopId}/products/images`,

  uploadMoreProductImages: () => ``,

  deleteProductImage: (shopId, productId, imageId) => `/shops/${shopId}/products/${productId}/images/${imageId}`,
  recognizeProductImages: (shopId, productId, imageId) =>
    `/shops/${shopId}/products/${productId}/images/${imageId}/recognize`,
  newProduct: shopId => `/shops/${shopId}/products/new`,

  createProduct: (shopId, productId) => `/shops/${shopId}/products/${productId}`,

  getProducts: (shopId, page) => `/shops/${shopId}/products?page=${page}`,

  getProduct: (shopId, productId) => `/shops/${shopId}/products/${productId}`,

  deleteProduct: (shopId, productId) => `/shops/${shopId}/products/${productId}`,

  newService: shopId => `/shops/${shopId}/services/new`,

  uploadServiceImages: shopId => `/shops/${shopId}/services/images`,

  deleteServiceImage: (shopId, serviceId, imageId) => `/shops/${shopId}/services/${serviceId}/images/${imageId}`,

  recognizeServiceImages: (shopId, serviceId, imageId) =>
    `/shops/${shopId}/services/${serviceId}/images/${imageId}/recognize`,

  getServices: (shopId, page) => `/shops/${shopId}/services?page=${page}`,

  deleteService: (shopId, serviceId) => `/shops/${shopId}/services/${serviceId}`,

  uploadProductMoreImages: (shopId, productId) => `/shops/${shopId}/products/${productId}/images`,

  createService: (shopId, serviceId) => `/shops/${shopId}/services/${serviceId}`,

  getService: (shopId, serviceId) => `/shops/${shopId}/services/${serviceId}`,

  uploadServicestMoreImages: (shopId, serviceId) => `/shops/${shopId}/services/${serviceId}/images`,

  // Shop Dashboard

  shopDashboard: '/seller/stats',

  //get order request for shop

  getShopOrderRequests: page => `/order_requests?page=${page}`,

  //get all categories
  getAllCategories: type => `/categories?type=${type}`,

  customeDashboard: (distance, longitude, latitude) =>
    `/customer/home?distance=${distance}&latitude=${latitude}&longitude=${longitude}`,

  search: (q, distance, longitude, latitude) =>
    `/search?q=${q}&distance=${distance}&longitude=${longitude}&latitude=${latitude}`,

  searhWithImage: '/search',

  viewAllProducts: (latitude, longitude, distance, product_page, shop_page) =>
    `/search_all?type=product&latitude=${latitude}&longitude=${longitude}&distance=${distance}&product_page=${product_page}&shop_page=${shop_page}`,

  viewAllServices: (latitude, longitude, distance, service_page) =>
    `/search_all?type=service&latitude=${latitude}&longitude=${longitude}&distance=${distance}&service_page=${service_page}`,

  // create order request

  createOrderRequest: '/customer/order_requests',

  // cancel request by customer

  cancelRequestCustomer: orderId => `/customer/order_requests/${orderId}`,

  //remove request by customer

  removeRequestCustomer: orderId => `/customer/order_requests/${orderId}/remove`,

  acceptAndrejectRequest: (orderID, mode) => `/seller/order_requests/${orderID}/${mode}`,

  removeRequestbySeller: orderId => `/seller/order_requests/${orderId}/remove`,

  //add to favourite

  addToFavourite: '/favorites',

  //Search by Shop

  searchByShop: (shopId, product_page, service_page) =>
    `search_by_shop/${shopId}?product_page=${product_page}&service_page=${service_page}`,

  // Search by category

  searchByCategory: (category, latitude, longitude, distance, product_page, service_page) =>
    `/search_by_category?q=${category}&latitude=${latitude}&longitude=${longitude}&distance=${distance}&product_page=${product_page}&service_page=${service_page}&shop_page=1`
}
