import { create } from 'apisauce'
import auth from './auth'

const baseURL = process.env.NEXT_PUBLIC_API_V1_BASE_URL

const client = create({
  baseURL
})

client.addAsyncRequestTransform(async request => {
  const token = localStorage.getItem(auth.storageTokenKeyName)

  if (!token) {
    return
  }

  request.headers['Authorization'] = `Bearer ${token}`
})

export const config = async () => {
  const token = localStorage.getItem(auth.storageTokenKeyName)
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  }
}

export const authConfig = async token => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  }
}

export const multipartConfig = async () => {
  const token = localStorage.getItem(auth.storageTokenKeyName)
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
}
export const blobConfig = async () => {
  const token = localStorage.getItem(auth.storageTokenKeyName)
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
      responseType: 'arraybuffer'
    }
  }
}

const responseMonitor = response => {
  // if (response.status === 401) {
  //   localStorage.clear()
  //   window.location.href = '/'
  // }
}

client.addMonitor(responseMonitor)

export default client
