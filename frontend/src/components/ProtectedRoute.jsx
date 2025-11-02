import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Loading from './Loading.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth()
  if (loading) return <Loading />
  if (!isAuth) return <Navigate to="/login" replace />
  return children
}
