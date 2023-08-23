export default {
  baseUrl: process.env.NEXT_PUBLIC_API_V1_BASE_URL,
  meEndpoint: '/users/tokens/info',
  loginEndpoint: '/users/tokens/sign_in',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  refreshTokenKeyName: 'refreshToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
