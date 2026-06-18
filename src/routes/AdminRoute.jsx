import { Navigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import Loader from '../components/Loader'

const AdminRoute = ({ children }) => {
  const { dbUser, loading } = useAuth()

  if (loading) return <Loader />

  if (!dbUser || dbUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
