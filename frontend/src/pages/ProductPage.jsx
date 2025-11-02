import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAuth, token } = useAuth()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const { data } = await api.get(`/api/products/${id}`)
        setProduct(data)
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load product')
      } finally { setLoading(false) }
    }
    load()
  }, [id])

  const order = async () => {
    if (!isAuth) { setError('Please login to place orders'); return }
    try {
      setError('')
      await api.post('/api/orders', { items: [{ product: product._id, qty: 1 }] }, { headers: { Authorization: `Bearer ${token}` } })
      alert('Order created! See Dashboard for details.')
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create order')
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!product) return null

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <img src={product.imageUrl || 'https://via.placeholder.com/600x400?text=Product'} alt={product.name} className="w-full rounded" />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        {product.category && <div className="text-sm text-gray-600 mb-1">Category: {product.category.name}</div>}
        <div className="text-xl font-semibold mb-4">₹{product.price}</div>
        <p className="mb-4 text-gray-700">{product.description}</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={order}>Order</button>
      </div>
    </div>
  )
}
