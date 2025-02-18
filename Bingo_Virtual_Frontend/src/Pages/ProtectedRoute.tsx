import { Navigate, Outlet} from 'react-router-dom'
import { useUser } from '../context/UserContext'
export const ProtectedRoute = () => {
    const {user, isAuthenticated} = useUser()
    if (!isAuthenticated) {
        return <Navigate to="/" replace/>
    }
  return (
    <Outlet/>
  )
}
