import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_ORDERS;

export default function OrderDetailsPanel({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.status);

  useEffect(() => {
    const handleOutside = (e) => {
      if (e.target.id === "modal-overlay") onClose();
    };
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, [onClose]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedOrder = { ...order, status: newStatus };
      await axios.put(`${API_URL}/${order.id}`, updatedOrder);
      setStatus(newStatus);
      onUpdate(updatedOrder);
    } catch (err) {
      console.error("Error updating order status:", err);
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

        <h2 className="text-2xl font-bold mb-4">Order Details</h2>

        <p className="mb-2"><strong>Customer:</strong> {order.customer_name || "N/A"}</p>
        <p className="mb-2"><strong>Restaurant:</strong> {order.restaurant_name || "N/A"}</p>
        <p className="mb-2"><strong>Status:</strong> <span className="font-semibold">{status}</span></p>
        <p className="mb-2"><strong>Payment Method:</strong> {order.payment_method || "N/A"}</p>
        <p className="mb-2"><strong>Delivery Time:</strong> {order.delivery_time ? new Date(order.delivery_time).toLocaleString() : "N/A"}</p>
        <p className="mb-4"><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>

        {order.items && order.items.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Items:</h3>
            <ul className="list-disc pl-5">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} x {item.quantity} — ${item.price}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => handleStatusChange("U PRIPREMI")}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
          >
            Prihvati (U pripremi)
          </button>
          <button
            onClick={() => handleStatusChange("ODBIJENO")}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Odbij
          </button>
          <button
            onClick={() => handleStatusChange("ZAVRSENO")}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Završeno
          </button>
        </div>
      </div>
    </div>
  );
}
