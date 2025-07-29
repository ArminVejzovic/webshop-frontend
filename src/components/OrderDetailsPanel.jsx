import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_ORDERS;

export default function OrderDetailsPanel({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const handleOutside = (e) => {
      if (e.target.id === "modal-overlay") onClose();
    };
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, [onClose]);

  useEffect(() => {
    if (order.items && order.items.length > 0) {
      const totalPrice = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotal(totalPrice);
    }
  }, [order.items]);

  const parseItemQuantities = (items) => {
    const itemIds = Array.isArray(items)
      ? items.flatMap(item => {
          const qty = parseInt(item.quantity) || 0;
          return Array(qty).fill(item.id);
        })
      : typeof items === "string"
        ? items.split(',').map(id => parseInt(id.trim(), 10))
        : [];

    const quantityMap = {};
    itemIds.forEach(id => {
      quantityMap[id] = (quantityMap[id] || 0) + 1;
    });

    return quantityMap;
  };

  const handleStatusChange = async (newStatus) => {
    const previousStatus = status;

    if (newStatus === previousStatus || previousStatus === "Finished") return;

    try {
      // Ako je items string (npr. "2, 2, 3, 3")
      // 1. Priprema item ID-ova
        const quantityMap = parseItemQuantities(order.items);
        console.log("Quantity map:", quantityMap);

  // 3. Oduzimanje zaliha ako ide u Accepted
  if (
    (previousStatus === "Processing" && newStatus === "Accepted") ||
    (previousStatus === "Rejected" && newStatus === "Accepted")
  ) {
    for (const [id, requestedQuantity] of Object.entries(quantityMap)) {
      const res = await axios.get(`${import.meta.env.VITE_API_URL_ARTICLES}/${id}`);
      const article = res.data;
      const current = article.quantity ?? 0;

      if (current < requestedQuantity) {
        throw new Error(`Nema dovoljno za "${article.name}" (traženo: ${requestedQuantity}, dostupno: ${current})`);
      }

      console.log(`Smanjujem artikal ${id} sa ${current} na ${current - requestedQuantity}`);

      await axios.put(`${import.meta.env.VITE_API_URL_ARTICLES}/${id}`, {
        ...article,
        quantity: Math.max(0, current - requestedQuantity)
      });
    }
  }

  // 4. Vraćanje zaliha ako ide iz Accepted u Rejected
  if (previousStatus === "Accepted" && newStatus === "Rejected") {
    for (const [id, returnedQuantity] of Object.entries(quantityMap)) {
      const res = await axios.get(`${import.meta.env.VITE_API_URL_ARTICLES}/${id}`);
      const article = res.data;
      const current = article.quantity ?? 0;

      console.log(`Vraćam artikal ${id} sa ${current} na ${current + returnedQuantity}`);

      await axios.put(`${import.meta.env.VITE_API_URL_ARTICLES}/${id}`, {
        ...article,
        quantity: current + returnedQuantity
      });
    }
  }

      // Ažuriranje narudžbe
      const updatedOrder = {
        id: order.id,
        items: Array.isArray(order.items)
          ? order.items.flatMap(item =>
              Array(item.quantity).fill(item.id)
            ).join(', ')
          : order.items,
        status: newStatus,
        created_at: order.created_at,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        customer_lastname: order.customer_lastname,
        customer_firstname: order.customer_firstname,
        processed_at: new Date().toISOString()
      };

      await axios.put(`${API_URL}/${order.id}`, updatedOrder);

      setStatus(newStatus);
      onUpdate({ ...order, status: newStatus });

    } catch (err) {
      console.error("Greška pri promjeni statusa narudžbe:", err.message || err);
      alert(`Greška: ${err.message}`);
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

        <div className="order-details">
          <p className="mb-2">
            <strong>Customer:</strong>{" "}
            {order.customer_firstname && order.customer_lastname
              ? `${order.customer_firstname} ${order.customer_lastname}`
              : "Unknown"}
          </p>
          <p className="mb-2">
            <strong>Status:</strong>{" "}
            <span className="font-semibold">{order.status || "Unknown"}</span>
          </p>
          <p className="mb-2">
            <strong>Created At:</strong>{" "}
            {order.created_at
              ? new Date(order.created_at).toLocaleString()
              : "Unknown"}
          </p>
          <p className="mb-2">
            <strong>Email:</strong>{" "}
            {order.customer_email || "Unknown"}
          </p>
          <p className="mb-2">
            <strong>Phone:</strong>{" "}
            {order.customer_phone || "Unknown"}
          </p>
          <p className="mb-2">
            <strong>Address:</strong>{" "}
            {order.customer_address || "Unknown"}
          </p>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Articles:</h3>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <li key={index} className="py-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Amount: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price per piece: ${item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right font-semibold">
                      ${ (item.quantity * item.price).toFixed(2) }
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right text-lg font-bold text-green-700">
              Total: ${total.toFixed(2)}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => handleStatusChange("Accepted")}
            disabled={status === "Finished"}
            className={`py-2 px-4 rounded text-white font-semibold 
              ${status === "Finished" ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"}`}
          >
            Accept
          </button>

          <button
            onClick={() => handleStatusChange("Rejected")}
            disabled={status === "Finished"}
            className={`py-2 px-4 rounded text-white font-semibold 
              ${status === "Finished" ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
          >
            Reject
          </button>

          <button
            onClick={() => handleStatusChange("Finished")}
            disabled={status !== "Accepted"}
            className={`px-4 py-2 rounded-md text-white font-semibold 
              ${status === "Accepted" ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
