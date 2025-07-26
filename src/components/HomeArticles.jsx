import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function HomeProducts() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ name: '', price: '', quantity: '' });
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
  axios.get(API_URL)
    .then(res => {
      setProducts(res.data);
    })
    .catch(err => {
      console.error('Error fetching products:', err);
    });
}, []);

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(filter.name.toLowerCase()))
    .filter(p => filter.price ? p.price.toString().includes(filter.price) : true)
    .filter(p => filter.quantity ? p.quantity.toString().includes(filter.quantity) : true)
    .sort((a, b) => {
      const da = new Date(a.created_at);
      const db = new Date(b.created_at);
      return sortAsc ? da - db : db - da;
    });

  return (
    <div>
      <div className="flex">
        <input
          placeholder="Filter by name"
          value={filter.name}
          onChange={e => setFilter({ ...filter, name: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Filter by price"
          value={filter.price}
          onChange={e => setFilter({ ...filter, price: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Filter by quantity"
          value={filter.quantity}
          onChange={e => setFilter({ ...filter, quantity: e.target.value })}
          className="border p-2"
        />
        <button
          onClick={() => setSortAsc(prev => !prev)}
          className="ml-auto bg-gray-200 px-4 py-2"
        >
          Sort by date: {sortAsc ? 'ASC' : 'DESC'}
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="border p-2 w-24">
                {p.image_base64 ? (
                  <img src={`data:image/png;base64,${p.image_base64}`} alt={p.name} className="h-16 mx-auto" />
                ) : (
                  <div className="bg-gray-200 h-16 mx-auto flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.price} $</td>
              <td className="border p-2">{p.quantity}</td>
              <td className="border p-2">{p.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
