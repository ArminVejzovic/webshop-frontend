import { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleDetailsPanel from "../components/ArticleDetailsPanel";

export default function HomeArticles() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState({ name: '', price: '', quantity: '' });
  const [sortAsc, setSortAsc] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchAdminArticles = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BACKEND_URL}/api/admin/articles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // osiguraj da je array
        const data = Array.isArray(res.data) ? res.data : [];
        setArticles(data);
      } catch (err) {
        console.error("Error fetching admin articles:", err);

        // ako je auth problem, izbaci usera na login
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          // ne koristimo navigate ovdje (nije hook), samo reload na login
          window.location.href = "/login";
          return;
        }

        setArticles([]); // da .filter nikad ne pukne
      }
    };

    fetchAdminArticles();
  }, []);

  const filtered = (Array.isArray(articles) ? articles : [])
    .filter(p => typeof p?.name === 'string' && p.name.toLowerCase().includes(filter.name.toLowerCase()))
    .filter(p => filter.price ? String(p?.price ?? '').includes(filter.price) : true)
    .filter(p => filter.quantity ? String(p?.quantity ?? '').includes(filter.quantity) : true)
    .sort((a, b) => {
      const da = new Date(a?.created_at);
      const db = new Date(b?.created_at);
      return sortAsc ? da - db : db - da;
    });

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowFilters(prev => !prev)}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm cursor-pointer"
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

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map(p => (
          <div
            key={p.id}
            className="border rounded-lg shadow hover:shadow-md transition duration-300 cursor-pointer flex flex-col"
            onClick={() => setSelectedArticle(p)}
          >
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.name}
                className="h-48 w-full object-cover rounded-t-lg"
              />
            ) : (
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-t-lg">
                No Image
              </div>
            )}
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-gray-700 text-sm">Price: {p.price} $</p>
              <p className="text-gray-700 text-sm">In Stock: {p.quantity}</p>
              <p className="text-gray-400 text-xs">
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
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedArticle && (
        <ArticleDetailsPanel
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onUpdate={(updated) => {
            if (updated) {
              setArticles((prev) =>
                (Array.isArray(prev) ? prev : []).map((p) => (p.id === updated.id ? updated : p))
              );
              setSelectedArticle(updated);
            } else {
              setArticles((prev) =>
                (Array.isArray(prev) ? prev : []).filter((p) => p.id !== selectedArticle.id)
              );
              setSelectedArticle(null);
            }
          }}
        />
      )}
    </div>
  );
}
