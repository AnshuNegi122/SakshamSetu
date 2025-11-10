/**
 * Authentication token management utilities
 */

const ACCESS_TOKEN_KEY = 'sakshamsetu_access_token'
const REFRESH_TOKEN_KEY = 'sakshamsetu_refresh_token'
const USER_KEY = 'sakshamsetu_user'

export interface User {
  _id: string
  name: string
  email: string
  role: 'PwD' | 'Donor' | 'Admin'
  location?: string
  disabilityType?: string
  udidVerified?: boolean
}

/**
 * Save tokens to localStorage
 */
export const saveTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }
  return null
}

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }
  return null
}

/**
 * Clear all tokens from localStorage
 */
export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

/**
 * Save user data to localStorage
 */
export const saveUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

/**
 * Get user data from localStorage
 */
export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY)
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

/**
 * Get user role
 */
export const getUserRole = (): string | null => {
  const user = getUser()
  return user?.role || null
}

