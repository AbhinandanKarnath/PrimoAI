import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  console.log('PrivateRoute: isAuthenticated:', isAuthenticated, 'loading:', loading)

  if (loading) {
    console.log('PrivateRoute: Showing loading spinner')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  console.log('PrivateRoute: Rendering:', isAuthenticated ? 'children' : 'redirect to login')
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
