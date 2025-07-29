import { useEffect, useState } from 'react';
import axios from 'axios';
import OrderDetailsPanel from '../components/OrderDetailsPanel';

const ORDERS_API = import.meta.env.VITE_API_URL_ORDERS;
const ARTICLES_API = import.meta.env.VITE_API_URL_ARTICLES;
const PAGE_SIZE = 6;

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [articlesMap, setArticlesMap] = useState({});
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    axios.get(ARTICLES_API).then(res => {
      const map = Object.fromEntries(res.data.map(a => [a.id.toString(), a]));
      setArticlesMap(map);
    });
    axios.get(ORDERS_API).then(res => setOrders(res.data));
  }, []);

  const sortedOrders = [...orders].sort((a, b) => {
    const da = new Date(a.created_at);
    const db = new Date(b.created_at);
    return sortAsc ? da - db : db - da;
  });

  const totalPages = Math.ceil(sortedOrders.length / PAGE_SIZE);
  const paginated = sortedOrders.slice((currentPage - 1)*PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSelect = (o) => {
    const itemsRaw = typeof o.items === 'string' ? o.items : Array.isArray(o.items) ? o.items.join(',') : '';
    const ids = itemsRaw.split(',').map(s => s.trim()).filter(Boolean);
    const counted = ids.reduce((acc,id) => {
      acc[id] = (acc[id] || 0)+1;
      return acc;
    }, {});
    const items = Object.entries(counted).map(([id,qty]) => {
      const art = articlesMap[id] || {};
      return {
        id, name: art.name||`ID ${id}`, quantity: qty, price: art.price||0
      };
    });
    const total = items.reduce((s,i) => s + i.quantity * i.price, 0);
    setSelectedOrder({ ...o, items, total });
  };

  const onUpdate = async (updated) => {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    setSelectedOrder(updated);
  };

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <button onClick={()=> setSortAsc(p=>!p)}
          className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Sort Date: {sortAsc ? 'ASC' : 'DESC'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginated.map(o => (
          <div key={o.id}
            className="bg-white rounded shadow hover:shadow-md p-4 cursor-pointer"
            onClick={()=>handleSelect(o)} >
            <div className="text-sm text-gray-500">Order #{o.id}</div>
            <div className="text-lg font-semibold">{o.customer_firstname} {o.customer_lastname}</div>
            <div className="text-sm">📧 {o.customer_email}</div>
            <div className="text-sm">📞 {o.customer_phone}</div>
            <div className="text-sm">📍 {o.customer_address}</div>
            <div className="text-sm">Status: {o.status}</div>
            <div className="text-xs text-gray-600">Created: {o.created_at}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center items-center gap-4">
        <button disabled={currentPage===1}
          onClick={()=>setCurrentPage(p=>p-1)}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50 cursor-pointer">Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage===totalPages}
          onClick={()=>setCurrentPage(p=>p+1)}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50 cursor-pointer">Next</button>
      </div>

      {selectedOrder && (
        <OrderDetailsPanel order={selectedOrder}
          onClose={()=>setSelectedOrder(null)}
          onUpdate={onUpdate} />
      )}
    </div>
  );
}
