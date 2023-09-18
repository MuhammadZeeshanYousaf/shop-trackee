// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

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

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      console.log(`${authConfig.storageTokenKeyName} ${storedToken}`)
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
        if (response.data.resource_owner.role == 'seller') router.replace('/shop')
        if (response.data.resource_owner.role == 'customer') router.replace('/listing')
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
        console.log('Cannot Sign in :(')
      })
  }

  const handleLogout = () => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    if (storedToken) {
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
        })
        .catch(() => {
          // handle logout error
        })
    } else {
      // session already expired
    }
  }

  const handleSignup = (params, errorCallback) => {
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
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
        console.log('Cannot Sign UP:(')
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
