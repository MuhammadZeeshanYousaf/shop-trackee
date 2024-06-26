// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

import { useLoader } from 'src/hooks'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  signup: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const { setLoader } = useLoader()

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.baseUrl + authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.resource_owner })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem(authConfig.refreshTokenKeyName)
            localStorage.removeItem(authConfig.storageTokenKeyName)
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    setLoader(true)
    axios
      .post(authConfig.baseUrl + authConfig.loginEndpoint, params)
      .then(async response => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token)
        params.rememberMe
          ? window.localStorage.setItem(authConfig.refreshTokenKeyName, response.data.refresh_token)
          : null
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.resource_owner })

        window.localStorage.setItem('userData', JSON.stringify(response.data.resource_owner))

        // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.resource_owner)) : null
        console.log('Signed in Successfully :)')
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        if (response.data.resource_owner.role == 'seller') router.replace('/shop-dashboard')
        if (response.data.resource_owner.role == 'customer') {
          localStorage.setItem('distance', 5)
          router.replace('/customer-dashboard')
        }
        setLoader(false)
      })
      .catch(err => {
        setLoader(false)
        if (errorCallback) errorCallback(err)
        console.log('Cannot Sign in :(')
      })
  }

  const handleLogout = () => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    if (storedToken) {
      setLoader(true)
      axios
        .post(authConfig.baseUrl + authConfig.logoutEndpoint, null, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(async response => {
          setUser(null)
          window.localStorage.removeItem('userData')
          window.localStorage.removeItem(authConfig.storageTokenKeyName)
          window.localStorage.removeItem(authConfig.refreshTokenKeyName)
          router.push('/login')
          setLoader(false)
        })
        .catch(() => {
          setLoader(false)

          // handle logout error
        })
    } else {
      // session already expired
    }
  }

  const handleSignup = (params, errorCallback) => {
    setLoader(true)
    axios
      .post(authConfig.baseUrl + authConfig.signupEndpoint, params)
      .then(async response => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token)
        window.localStorage.setItem(authConfig.refreshTokenKeyName, response.data.refresh_token)
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.resource_owner })
        window.localStorage.setItem('userData', JSON.stringify(response.data.resource_owner))
        console.log('Signed UP Successfully :)')
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        if (response.data.resource_owner.role == 'seller') router.replace('/shop-dashboard')
        if (response.data.resource_owner.role == 'customer') {
          localStorage.setItem('distance', 5)
          router.replace('/customer-dashboard')
        }

        setLoader(false)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
        console.log('Cannot Sign UP:(')
        setLoader(false)
      })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    signup: handleSignup
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
