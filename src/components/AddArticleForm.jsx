import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_ARTICLES;

const AddArticleForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image_url: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        image_url: form.image_url,
        created_at: new Date().toISOString(),
      };

      await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      navigate("/admin-dashboard", { state: { section: "home" } });
    } catch (error) {
      console.error("Error adding article: ", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Article Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">
            Name: <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Description: <span className="text-red-600">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Price: <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Quantity: <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Image URL: <span className="text-gray-500 text-sm">(optional)</span>
          </label>
          <input
            type="url"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <p className="text-sm text-gray-600">
          <span className="text-red-600">*</span> Required fields
        </p>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition cursor-pointer"
        >
          Add Article
        </button>
      </form>
    </div>
  );
};

export default AddArticleForm;
