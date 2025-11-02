import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../lib/api.js'

export default function Dashboard() {
  const { token, user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/api/orders/my', { headers: { Authorization: `Bearer ${token}` } })
        setOrders(data)
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load orders')
      } finally { setLoading(false) }
    }
    load()
  }, [token])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-3">Welcome {user?.name}. Here are your orders:</p>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <span className="font-semibold">Order #{o._id}</span>
              <span className="text-sm">{o.status}</span>
            </div>
            <div className="text-sm text-gray-600">Items: {o.items?.length} • Total: ₹{o.total}</div>
          </div>
        ))}
        {(!loading && orders.length === 0) && <div>No orders yet.</div>}
      </div>
    </div>
  )
}
