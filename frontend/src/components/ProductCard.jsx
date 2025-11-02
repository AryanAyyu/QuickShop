import { Link } from 'react-router-dom'

export default function ProductCard({ product, onOrder }) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <img src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product'} alt={product.name} className="w-full h-40 object-cover rounded" />
      <div className="mt-3">
        <h3 className="font-semibold text-lg">
          <Link to={`/product/${product._id}`} className="hover:underline">{product.name}</Link>
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold">₹{product.price?.toFixed ? product.price.toFixed(2) : product.price}</span>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => onOrder(product)}>Order</button>
        </div>
      </div>
    </div>
  )
}
