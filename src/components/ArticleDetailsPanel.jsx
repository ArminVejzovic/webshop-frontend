import { useState } from "react";
import axios from "axios";

export default function ArticleDetailsPanel({ article, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...article });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
      };

      const res = await axios.put(
        `${BACKEND_URL}/api/admin/articles/${article.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // backend vraća updateovani article (iz Retool-a)
      onUpdate(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${BACKEND_URL}/api/admin/articles/${article.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onUpdate(null); // signal HomeArticles da izbaci item
    } catch (err) {
      console.error("Error deleting:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 lg:mx-0 p-6 relative overflow-auto max-h-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl cursor-pointer"
        >
          &times;
        </button>

        {!isEditing ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{article.name}</h2>

            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.name}
                className="w-full h-64 object-contain mb-4 bg-gray-100 rounded"
              />
            )}

            <p className="mb-2">
              <strong>Description:</strong> {article.description}
            </p>
            <p className="mb-2">
              <strong>Price:</strong> ${article.price}
            </p>
            <p className="mb-2">
              <strong>Quantity:</strong> {article.quantity}
            </p>
            <p className="mb-2">
              <strong>Created at:</strong>{" "}
              {article.created_at
                ? new Date(article.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A"}
            </p>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>

            <input
              name="name"
              value={form.name ?? ""}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border p-2 mb-3 rounded"
            />
            <textarea
              name="description"
              value={form.description ?? ""}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price ?? ""}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              name="quantity"
              type="number"
              value={form.quantity ?? ""}
              onChange={handleChange}
              placeholder="Quantity"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              name="image_url"
              type="url"
              value={form.image_url ?? ""}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full border p-2 mb-3 rounded"
            />

            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setForm({ ...article });
                }}
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
