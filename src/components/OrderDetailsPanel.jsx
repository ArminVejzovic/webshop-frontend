import { useState, useEffect } from "react";
import axios from "axios";

export default function OrderDetailsPanel({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);

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
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      );
      setTotal(totalPrice);
    } else {
      setTotal(0);
    }
  }, [order.items]);

  const parseItemQuantities = (items) => {
    // items u ovom panelu je obično array: [{id,name,quantity,price},...]
    if (Array.isArray(items)) {
      const map = {};
      items.forEach((it) => {
        const id = String(it.id);
        const qty = parseInt(it.quantity, 10) || 0;
        map[id] = (map[id] || 0) + qty;
      });
      return map;
    }

    // fallback ako ikad dođe string "23, 23, 24"
    if (typeof items === "string") {
      const ids = items.split(",").map(s => s.trim()).filter(Boolean);
      const map = {};
      ids.forEach((id) => {
        map[id] = (map[id] || 0) + 1;
      });
      return map;
    }

    return {};
  };

  const handleStatusChange = async (newStatus) => {
    const previousStatus = status;

    if (newStatus === previousStatus || previousStatus === "Finished") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const quantityMap = parseItemQuantities(order.items);

      // ✅ sve ide preko BACKEND rute (ne Retool)
      // 1) Ako idemo na Accepted, provjeri i skini stock
      if (
        (previousStatus === "Processing" && newStatus === "Accepted") ||
        (previousStatus === "Rejected" && newStatus === "Accepted")
      ) {
        for (const [id, requestedQuantity] of Object.entries(quantityMap)) {
          const res = await axios.get(`${BACKEND_URL}/api/admin/articles`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const list = Array.isArray(res.data) ? res.data : [];
          const article = list.find(a => String(a.id) === String(id));

          if (!article) throw new Error(`Article ID ${id} not found`);

          const current = Number(article.quantity ?? 0);
          if (current < requestedQuantity) {
            throw new Error(
              `There is not enough of the article "${article.name}" (need: ${requestedQuantity}, have: ${current})`
            );
          }

          await axios.put(
            `${BACKEND_URL}/api/admin/articles/${id}`,
            { ...article, quantity: Math.max(0, current - requestedQuantity) },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      // 2) Ako vraćaš sa Accepted -> Rejected, vrati stock
      if (previousStatus === "Accepted" && newStatus === "Rejected") {
        for (const [id, returnedQuantity] of Object.entries(quantityMap)) {
          const res = await axios.get(`${BACKEND_URL}/api/admin/articles`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const list = Array.isArray(res.data) ? res.data : [];
          const article = list.find(a => String(a.id) === String(id));

          if (!article) continue;

          const current = Number(article.quantity ?? 0);

          await axios.put(
            `${BACKEND_URL}/api/admin/articles/${id}`,
            { ...article, quantity: current + Number(returnedQuantity) },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      // 3) Update order status preko backend-a
      // items mora ostati string "23, 23, 24"
      const itemsAsString = Array.isArray(order.items)
        ? order.items.flatMap(item => Array(Number(item.quantity || 0)).fill(item.id)).join(", ")
        : (typeof order.items === "string" ? order.items : "");

      const updatedOrder = {
        ...order,
        items: itemsAsString,
        status: newStatus,
        processed_at: new Date().toISOString(),
      };

      const putRes = await axios.put(
        `${BACKEND_URL}/api/admin/orders/${order.id}`,
        updatedOrder,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedFromBackend = putRes.data;

      const uiUpdated = {
        ...order,
        status: updatedFromBackend?.status || newStatus,
        processed_at: updatedFromBackend?.processed_at || new Date().toISOString(),
      };

      setStatus(uiUpdated.status);
      onUpdate(uiUpdated);


    } catch (err) {
      console.error("Greška pri promjeni statusa narudžbe:", err?.message || err);

      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Greška pri promjeni statusa.";

      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 3000);

      if (err?.response?.status === 401 || err?.response?.status === 403) {
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

        <h2 className="text-2xl font-bold mb-4">Order Details</h2>

        <div className="order-details">
          <p className="mb-2">
            <strong>Customer:</strong>{" "}
            {order.customer_firstname && order.customer_lastname
              ? `${order.customer_firstname} ${order.customer_lastname}`
              : "Unknown"}
          </p>

          {/* ✅ prikazuj state status, ne order.status */}
          <p className="mb-2">
            <strong>Status:</strong>{" "}
            <span className="font-semibold">{status || "Unknown"}</span>
          </p>

          <p className="mb-2">
            <strong>Created At:</strong>{" "}
            {order.created_at ? new Date(order.created_at).toLocaleString() : "Unknown"}
          </p>

          <p className="mb-2">
            <strong>Processed At:</strong>{" "}
            {order.processed_at ? new Date(order.processed_at).toLocaleString() : "Not processed yet"}
          </p>

          <p className="mb-2"><strong>Email:</strong> {order.customer_email || "Unknown"}</p>
          <p className="mb-2"><strong>Phone:</strong> {order.customer_phone || "Unknown"}</p>
          <p className="mb-2"><strong>Address:</strong> {order.customer_address || "Unknown"}</p>
        </div>

        {Array.isArray(order.items) && order.items.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Articles:</h3>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <li key={index} className="py-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Amount: {item.quantity}</p>
                      <p className="text-sm text-gray-600">
                        Price per piece: ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right font-semibold">
                      ${(Number(item.quantity) * Number(item.price)).toFixed(2)}
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

        {errorMessage && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 border border-red-400 rounded">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => handleStatusChange("Accepted")}
            disabled={status === "Finished"}
            className={`py-2 px-4 rounded text-white font-semibold
              ${status === "Finished" ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 cursor-pointer"}`}
          >
            Accept
          </button>

          <button
            onClick={() => handleStatusChange("Rejected")}
            disabled={status === "Finished"}
            className={`py-2 px-4 rounded text-white font-semibold
              ${status === "Finished" ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 cursor-pointer"}`}
          >
            Reject
          </button>

          <button
            onClick={() => handleStatusChange("Finished")}
            disabled={status !== "Accepted"}
            className={`px-4 py-2 rounded-md text-white font-semibold
              ${status === "Accepted" ? "bg-green-600 hover:bg-green-700 cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
