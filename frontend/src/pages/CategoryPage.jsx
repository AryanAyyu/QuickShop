import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api.js'
import ProductCard from '../components/ProductCard.jsx'

export default function CategoryPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [{ data: cats }, { data: prods }] = await Promise.all([
          api.get('/api/categories'),
          api.get(`/api/products?category=${encodeURIComponent(slug)}`)
        ])
        setProducts(prods)
        const cat = cats.find(c => c.slug === slug)
        setCategoryName(cat?.name || slug)
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load category')
      } finally { setLoading(false) }
    }
    load()
  }, [slug])

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold mb-4">Category: {categoryName}</h1>
        <Link to="/" className="text-blue-600">Home</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <ProductCard key={p._id} product={p} onOrder={() => {}} />
        ))}
        {products.length === 0 && <div>No products in this category yet.</div>}
      </div>
    </div>
  )
}
