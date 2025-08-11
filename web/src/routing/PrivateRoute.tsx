import useUser from '@/context/user'
import { Navigate, RouteProps } from 'react-router-dom'
import { LoadingOverlay as Loading } from '@mantine/core'
import { UserRole } from '@/interfaces'

interface RoleRouteProps {
  children: React.ReactElement
  userRole?: UserRole
}

type PrivateRouteProps = RouteProps & RoleRouteProps

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
  userRole,
  children,
}: PrivateRouteProps) => {
  const { user, keycloak } = useUser()

  if (!keycloak?.authenticated) {
    console.log(keycloak)

    return <Navigate to="/" state={window.location.href} />
  }

  if (!user) {
    return <Loading visible={true} />
  } else if (user && userRole && user.role !== userRole) {
    return <Navigate to="/organization" state={window.location.href} />
  }

  return children
}

export default PrivateRoute
