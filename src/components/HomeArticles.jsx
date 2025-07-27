import { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleDetailsPanel from "../components/ArticleDetailsPanel";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomeArticles() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState({ name: '', price: '', quantity: '' });
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
  axios.get(API_URL)
    .then(res => {
      setArticles(res.data);
    })
    .catch(err => {
      console.error('Error fetching articles:', err);
    });
}, []);

  const filtered = articles
  .filter(p => typeof p.name === 'string' && p.name.toLowerCase().includes(filter.name.toLowerCase()))
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
            <tr
							key={p.id}
							className="hover:bg-gray-200 cursor-pointer"
							onClick={() => setSelectedArticle(p)}
							>
              <td className="border p-2 w-24">
                 {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-30 mx-auto object-contain" />
                ) : (
                    <div className="bg-gray-200 h-16 mx-auto flex items-center justify-center text-gray-500 text-sm">
                        No Image
                    </div>
                )}
                </td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.price} $</td>
              <td className="border p-2">{p.quantity}</td>
              <td className="border p-2">
                {p.created_at
                    ? new Date(p.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    })
                    : "N/A"}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
			
			{selectedArticle && (
				<ArticleDetailsPanel
					article={selectedArticle}
					onClose={() => setSelectedArticle(null)}
					onUpdate={(updated) => {
						if (updated) {
							setArticles((prev) =>
								prev.map((p) => (p.id === updated.id ? updated : p))
							);
							setSelectedArticle(updated);
						} else {
							setArticles((prev) =>
								prev.filter((p) => p.id !== selectedArticle.id)
							);
							setSelectedArticle(null);
						}
					}}
				/>
			)}

			
    </div>
  );
}
