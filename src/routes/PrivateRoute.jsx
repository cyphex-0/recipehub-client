import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import Loader from '../components/Loader'

const PrivateRoute = ({ children }) => {
  const { dbUser, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader />

  if (!dbUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default PrivateRoute
