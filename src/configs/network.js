import client from './apiConfig'

export default {
  get: async (url, headers, data, config = {}) => {
    if (headers) client.setHeaders(headers)

    return await client.get(url, data, config)
  },
  post: async (url, data, headers, config = {}) => {
    if (headers) client.setHeaders(headers)

    return await client.post(url, data, config)
  },
  put: async (url, data, headers) => {
    if (headers) client.setHeaders(headers)

    return await client.put(url, data)
  },
  delete: async (url, data, headers) => {
    if (headers) client.setHeaders(headers)

    return await client.delete(url, data)
  },
  patch: async (url, data, headers) => {
    if (headers) client.setHeader(headers)

    return await client.patch(url, data)
  }
}
