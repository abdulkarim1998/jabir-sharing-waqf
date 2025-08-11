import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MantineProvider, createEmotionCache } from '@mantine/core'
import {
  Organization,
  AdminOrganization,
  User,
  Dashboard,
  OrganizationTabs,
  FoundationProfile,
  WaqfFlowController,
} from './pages'
import './styles/fonts.scss'
import { UserProvider } from './context/user'
import PrivateRoute from './routing/PrivateRoute'
import rtlPlugin from 'stylis-plugin-rtl'
import { UserRole, WaqfType } from './interfaces'
import * as echarts from 'echarts/core'
import theme from './custom-theme.json'
import JabirFoundationProfile from './pages/jabirFoundationProfile/JabirFoundationProfile'
import DashboardProvider from './pages/dashboard/context'
echarts.registerTheme('my_theme', theme)

const rtlCache = createEmotionCache({
  key: 'mantine-rtl',
  stylisPlugins: [rtlPlugin],
})

const App = (): JSX.Element => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      emotionCache={rtlCache}
      theme={{
        colorScheme: 'light',
        fontFamily: 'DIN Next LT W23, sans-serif',
        lineHeight: '1.3rem',
        spacing: {
          sm: '1rem',
          md: '1.25rem',
          lg: '1.5rem',
          xl: '5rem',
        },
        dir: 'rtl',
      }}
    >
      {/* <UserProvider> */}
        <BrowserRouter basename="/waqf">
          <Routes>
            <Route path="/" element={<Organization />} />

            <Route
              path="/project/id/:projectId/waqfType"
              element={<WaqfFlowController />}
            />
            {Object.keys(WaqfType).map((key) => (
              <Route
                key={key}
                path={`/project/id/:projectId/waqfType/${WaqfType[key]}`}
                element={<WaqfFlowController waqfType={WaqfType[key]} />}
              />
            ))}
            <Route
              path="/organizations/id/:organizationId"
              element={<FoundationProfile />}
            />
            <Route path="/jf" element={<JabirFoundationProfile />} />
            <Route
              path="/dashboard"
              element={
                <DashboardProvider>
                  <Dashboard />
                </DashboardProvider>
              }
            />
            <Route
              path="/organization"
              element={
                <PrivateRoute>
                  <AdminOrganization />
                </PrivateRoute>
              }
            />
            <Route
              path="/organization/:organizationId"
              element={
                <PrivateRoute>
                  <OrganizationTabs />
                </PrivateRoute>
              }
            />
            <Route
              path="/user"
              element={
                <PrivateRoute userRole={UserRole.ADMIN}>
                  <User />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      {/* </UserProvider> */}
    </MantineProvider>
  )
}

export default App
