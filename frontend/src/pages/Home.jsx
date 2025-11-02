import { useEffect, useState } from 'react'
import api from '../lib/api.js'
import ProductCard from '../components/ProductCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token, isAuth } = useAuth()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [p, c] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/categories')
        ])
        setProducts(p.data)
        setCategories(c.data)
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load products')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const order = async (p) => {
    if (!isAuth) { setError('Please login to place orders'); return }
    try {
      setError('')
      await api.post('/api/orders', { items: [{ product: p._id, qty: 1 }] }, { headers: { Authorization: `Bearer ${token}` } })
      alert('Order created! See Dashboard for details.')
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create order')
    }
  }

  if (loading) return <div className="p-6">Loading products...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">QuickShop</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Browse by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <a key={c._id} href={`/category/${c.slug}`} className="px-3 py-1 bg-white border rounded hover:bg-gray-50">{c.name}</a>
          ))}
          {categories.length === 0 && <div>No categories yet.</div>}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Recently Added</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.slice(0,6).map(p => (
            <ProductCard key={p._id} product={p} onOrder={order} />
          ))}
          {products.length === 0 && <div>No products yet.</div>}
        </div>
      </section>

      {categories.map(cat => {
        const inCat = products.filter(p => p.category && (p.category.slug === cat.slug || p.category === cat._id)).slice(0,6)
        if (inCat.length === 0) return null
        return (
          <section key={cat._id} className="mb-8">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">{cat.name}</h3>
              <a href={`/category/${cat.slug}`} className="text-blue-600 text-sm">View all</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {inCat.map(p => (
                <ProductCard key={p._id} product={p} onOrder={order} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
