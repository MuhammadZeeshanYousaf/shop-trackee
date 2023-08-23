export default {
  baseUrl: process.env.NEXT_PUBLIC_API_V1_BASE_URL,
  meEndpoint: '/users/tokens/info',
  loginEndpoint: '/users/tokens/sign_in',
  signupEndpoint: '/users/tokens/sign_up',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  refreshTokenKeyName: 'refreshToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
