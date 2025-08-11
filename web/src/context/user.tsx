import { User, UserRole } from '@/interfaces'
import { LoadingOverlay } from '@mantine/core'
import axios, { AxiosInstance } from 'axios'
import Keycloak from 'keycloak-js'
import React, { PropsWithChildren, useEffect, useState } from 'react'

const keycloak = new Keycloak({
  clientId: 'jw-app',
  realm: 'apps',
  url: 'https://keycloak-02.rihal.tech',
})

export const axiosServer = axios.create({ baseURL: '/api/' })

interface UserContextValue {
  user: User
  // TODO: FIXME: Update axios-case-converter to use axios as peer dep
  logout: () => void
  // TODO: take options obj
  login: () => void
  keycloak: Keycloak
  axiosServer: AxiosInstance
}

const UserContext = React.createContext<UserContextValue>({
  user: userFromToken(),
  logout: undefined,
  login: undefined,
  keycloak: undefined,
  axiosServer: axiosServer,
})

// TODO: This should not be used, instead get user from BE when API is ready
function userFromToken(): User {
  if (keycloak.token) {
    const decoded = keycloak.idTokenParsed as any
    console.log('decoding user with token: ', { decoded })
    return {
      firstName: decoded['given_name'],
      lastName: decoded['family_name'],
      email: decoded['email'],
      role: UserRole.ADMIN,
      id: 'FIXME',
      phone: 0,
    }
  }
  return undefined
}

// TODO: instead of sending users straight to login we could first send them to
// 401 page.
export const UserProvider = ({
  children,
}: PropsWithChildren<Record<never, never>>): JSX.Element => {
  const [user, setUser] = useState<User>()

  // Update axios so it adds the Bearer token in the header of each request.
  const updateAxiosInterceptor = () => {
    axiosServer.interceptors.request.eject(1)
    axiosServer.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${keycloak.token}`
        return config
      },
      (error) => Promise.reject(error)
    )
    console.log('setting axios interceptor to use token')
  }
  updateAxiosInterceptor()

  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/waqf/silent-check-sso.html`,
      })
      .then(async () => setInitialized(true))
      .catch((error) => console.log('failed to init keycloak: ', error))

    keycloak.onAuthSuccess = async () => {
      // const { data }: AxiosResponse<User> = await axiosServer.get('user')
      const data = userFromToken()
      setUser(data)
    }

    keycloak.onAuthError = () => {
      setUser(undefined)
    }

    // update axios intercepter when token refreshed
    keycloak.onAuthRefreshSuccess = () => {
      updateAxiosInterceptor()
    }

    // refresh token on expiry
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(10)
    }
  }, [])

  const logout = () => {
    keycloak.logout({ redirectUri: `${window.location.origin}/waqf` })
  }

  const login = () => {
    keycloak.login({
      redirectUri: `${window.location.origin}/waqf/organization`,
    })
  }

  return !initialized ? (
    <LoadingOverlay visible={false} />
  ) : (
    <UserContext.Provider
      value={{
        user,
        logout,
        login,
        keycloak,
        axiosServer,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
const useUser = (): UserContextValue => React.useContext(UserContext)

export default useUser
