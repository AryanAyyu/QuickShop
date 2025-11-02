import { useEffect, useState } from 'react'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminDashboard() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '', category: '', imageUrl: '' })
  const [categories, setCategories] = useState([])
  const [newCat, setNewCat] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [error, setError] = useState('')
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', price: '', stock: '', description: '', category: '', imageUrl: '' })
  const headers = { Authorization: `Bearer ${token}` }

  const load = async () => {
    try {
      const [p, o, c] = await Promise.all([
        api.get('/api/products', { params: filterCat ? { category: filterCat } : {} }),
        api.get('/api/orders', { headers }),
        api.get('/api/categories')
      ])
      setProducts(p.data)
      setOrders(o.data)
      setCategories(c.data)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load admin data')
    }
  }

  useEffect(() => { load() }, [filterCat])

  const create = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/products', { name: form.name, price: Number(form.price), stock: Number(form.stock), description: form.description, category: form.category, imageUrl: form.imageUrl }, { headers })
      setForm({ name: '', price: '', stock: '', description: '', category: '', imageUrl: '' })
      await load()
    } catch (e) { setError(e.response?.data?.message || 'Create failed') }
  }

  const del = async (id) => {
    try { await api.delete(`/api/products/${id}`, { headers }); await load() } catch (e) { setError(e.response?.data?.message || 'Delete failed') }
  }

  const createCat = async (e) => {
    e.preventDefault()
    try { await api.post('/api/categories', { name: newCat }, { headers }); setNewCat(''); await load() } catch (e) { setError(e.response?.data?.message || 'Category create failed') }
  }
  const delCat = async (id) => {
    try { await api.delete(`/api/categories/${id}`, { headers }); await load() } catch (e) { setError(e.response?.data?.message || 'Category delete failed') }
  }

  const startEdit = (p) => {
    setEditId(p._id)
    setEditForm({
      name: p.name || '',
      price: String(p.price ?? ''),
      stock: String(p.stock ?? ''),
      description: p.description || '',
      category: p.category?.slug || '',
      imageUrl: p.imageUrl || ''
    })
  }
  const cancelEdit = () => { setEditId(null) }
  const saveEdit = async (id) => {
    try {
      await api.put(`/api/products/${id}`, {
        name: editForm.name,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        description: editForm.description,
        category: editForm.category,
        imageUrl: editForm.imageUrl
      }, { headers })
      setEditId(null)
      await load()
    } catch (e) { setError(e.response?.data?.message || 'Update failed') }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Products</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="bg-white p-3 rounded shadow mb-3 flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter by Category:</label>
          <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} className="border p-2 rounded">
            <option value="">All</option>
            {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <form onSubmit={create} className="bg-white p-4 rounded shadow mb-4 grid grid-cols-2 gap-2">
          <input className="border p-2 rounded col-span-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="border p-2 rounded" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
          <input className="border p-2 rounded" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} />
          <input className="border p-2 rounded col-span-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          <input className="border p-2 rounded col-span-2" placeholder="Image URL (https://...)" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})} />
          <select className="border p-2 rounded col-span-2" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
          </select>
          <button className="bg-blue-600 text-white p-2 rounded col-span-2">Add Product</button>
        </form>
        <div className="space-y-2">
          {products.map(p => (
            <div key={p._id} className="bg-white p-3 rounded shadow">
              {editId === p._id ? (
                <div className="grid grid-cols-2 gap-2">
                  <input className="border p-2 rounded col-span-2" value={editForm.name} onChange={e=>setEditForm({...editForm, name:e.target.value})} />
                  <input className="border p-2 rounded" value={editForm.price} onChange={e=>setEditForm({...editForm, price:e.target.value})} />
                  <input className="border p-2 rounded" value={editForm.stock} onChange={e=>setEditForm({...editForm, stock:e.target.value})} />
                  <input className="border p-2 rounded col-span-2" value={editForm.description} onChange={e=>setEditForm({...editForm, description:e.target.value})} />
                  <input className="border p-2 rounded col-span-2" placeholder="Image URL" value={editForm.imageUrl} onChange={e=>setEditForm({...editForm, imageUrl:e.target.value})} />
                  <select className="border p-2 rounded col-span-2" value={editForm.category} onChange={e=>setEditForm({...editForm, category:e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                  </select>
                  <div className="col-span-2 flex gap-2 justify-end">
                    <button className="px-3 py-1 bg-gray-200 rounded" onClick={cancelEdit} type="button">Cancel</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={()=>saveEdit(p._id)} type="button">Save</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrl || 'https://via.placeholder.com/80x60?text=Img'} alt={p.name} className="w-20 h-16 object-cover rounded" />
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-600">₹{p.price} • Stock: {p.stock} {p.category && `• ${p.category.name || ''}`}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>startEdit(p)}>Edit</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={()=>del(p._id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">All Orders</h2>
        <div className="space-y-2">
          {orders.map(o => (
            <div key={o._id} className="bg-white p-3 rounded shadow">
              <div className="flex justify-between">
                <span className="font-semibold">Order #{o._id}</span>
                <span className="text-sm">{o.status}</span>
              </div>
              <div className="text-sm text-gray-600">By: {o.user?.name} ({o.user?.email}) • Items: {o.items?.length} • Total: ₹{o.total}</div>
            </div>
          ))}
          {orders.length === 0 && <div>No orders yet.</div>}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Categories</h2>
          <form onSubmit={createCat} className="bg-white p-3 rounded shadow mb-3 flex gap-2">
            <input className="border p-2 rounded flex-1" placeholder="New Category Name" value={newCat} onChange={e=>setNewCat(e.target.value)} />
            <button className="bg-green-600 text-white px-3 rounded">Add</button>
          </form>
          <div className="space-y-2">
            {categories.map(c => (
              <div key={c._id} className="bg-white p-2 rounded shadow flex justify-between items-center">
                <div>{c.name}</div>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={()=>delCat(c._id)}>Delete</button>
              </div>
            ))}
            {categories.length === 0 && <div>No categories yet.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
