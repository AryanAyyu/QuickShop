import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { isAuth, user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">QuickShop</Link>
        <div className="flex gap-4 items-center">
          {!isAuth && <>
            <Link to="/login" className="text-blue-600">Login</Link>
            <Link to="/register" className="text-blue-600">Register</Link>
          </>}
          {isAuth && <>
            <span className="text-sm text-gray-600">Hi, {user?.name} ({user?.role})</span>
            <Link to="/dashboard" className="text-blue-600">Dashboard</Link>
            {user?.role === 'admin' && <Link to="/admin" className="text-blue-600">Admin</Link>}
            <button onClick={() => { logout(); navigate('/') }} className="px-3 py-1 bg-gray-200 rounded">Logout</button>
          </>}
        </div>
      </div>
    </nav>
  )
}
