import { useEffect, useState } from 'react';
import axios from 'axios';
import OrderDetailsPanel from '../components/OrderDetailsPanel';

const PAGE_SIZE = 6;

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [articlesMap, setArticlesMap] = useState({});
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");

        // 1) articles (za mapiranje ID -> naziv, cijena)
        const aRes = await axios.get(`${BACKEND_URL}/api/admin/articles`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const articlesArr = Array.isArray(aRes.data) ? aRes.data : [];
        const map = Object.fromEntries(
          articlesArr.map(a => [String(a.id), a])
        );
        setArticlesMap(map);

        // 2) orders
        const oRes = await axios.get(`${BACKEND_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ordersArr = Array.isArray(oRes.data) ? oRes.data : [];
        setOrders(ordersArr);

      } catch (err) {
        console.error("Error fetching admin data:", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        setOrders([]);
        setArticlesMap({});
      }
    };

    fetchData();
  }, []);

  const sortedOrders = (Array.isArray(orders) ? [...orders] : []).sort((a, b) => {
    const da = new Date(a?.created_at);
    const db = new Date(b?.created_at);
    return sortAsc ? da - db : db - da;
  });

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / PAGE_SIZE));
  const paginated = sortedOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ako se smanji broj stranica (npr. kad nema orders), vrati na 1
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const handleSelect = (o) => {
    // items dolazi kao "23, 23, 24" (string) - ali imamo fallbackove
    const itemsRaw =
      typeof o?.items === 'string'
        ? o.items
        : Array.isArray(o?.items)
          ? o.items.join(',')
          : '';

    const ids = itemsRaw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // count: { "23": 2, "24": 1 }
    const counted = ids.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const items = Object.entries(counted).map(([id, qty]) => {
      const art = articlesMap[id] || {};
      return {
        id,
        name: art.name || `ID ${id}`,
        quantity: qty,
        price: Number(art.price || 0),
      };
    });

    const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

    setSelectedOrder({ ...o, items, total });
  };

  // NOTE: OrderDetailsPanel ti vjerovatno vraća updated order iz backend-a.
  // Ovdje samo syncamo state.
  const onUpdate = (updated) => {
    setOrders(prev =>
      prev.map(o => o.id === updated.id
        ? { ...o, status: updated.status, processed_at: updated.processed_at }
        : o
      )
    );
    setSelectedOrder(updated);
  };

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <button
          onClick={() => setSortAsc(p => !p)}
          className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Sort Date: {sortAsc ? 'ASC' : 'DESC'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginated.map(o => (
          <div
            key={o.id}
            className="bg-white rounded shadow hover:shadow-md p-4 cursor-pointer"
            onClick={() => handleSelect(o)}
          >
            <div className="text-sm text-gray-500">Order #{o.id}</div>
            <div className="text-lg font-semibold">
              {o.customer_firstname} {o.customer_lastname}
            </div>
            <div className="text-sm">📧 {o.customer_email}</div>
            <div className="text-sm">📞 {o.customer_phone}</div>
            <div className="text-sm">📍 {o.customer_address}</div>
            <div className="text-sm">Status: {o.status}</div>
            <div className="text-xs text-gray-600">Created: {o.created_at}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>

      {selectedOrder && (
        <OrderDetailsPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
