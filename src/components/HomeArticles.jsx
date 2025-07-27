import { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleDetailsPanel from "../components/ArticleDetailsPanel";

const API_URL = import.meta.env.VITE_API_URL_ARTICLES;

export default function HomeArticles() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState({ name: '', price: '', quantity: '' });
  const [sortAsc, setSortAsc] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
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
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowFilters(prev => !prev)}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            placeholder="Filter by name"
            value={filter.name}
            onChange={e => setFilter({ ...filter, name: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            placeholder="Filter by price"
            value={filter.price}
            onChange={e => setFilter({ ...filter, price: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            placeholder="Filter by quantity"
            value={filter.quantity}
            onChange={e => setFilter({ ...filter, quantity: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button
            onClick={() => setSortAsc(prev => !prev)}
            className="bg-gray-200 text-gray-800 p-2 rounded w-full"
          >
            Sort by date: {sortAsc ? 'ASC' : 'DESC'}
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr
                key={p.id}
                className="border-t hover:bg-gray-200 cursor-pointer"
                onClick={() => setSelectedArticle(p)}
              >
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2 w-24">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-16 w-full object-contain mx-auto" />
                  ) : (
                    <div className="bg-gray-200 h-16 flex items-center justify-center text-gray-500 text-xs">
                      No Image
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.price} $</td>
                <td className="px-4 py-2">{p.quantity}</td>
                <td className="px-4 py-2">
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
      </div>

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
