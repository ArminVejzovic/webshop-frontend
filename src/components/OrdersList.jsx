import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL_ORDERS;
const PAGE_SIZE = 5;

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error fetching orders:', err));
  }, []);

  const sortedOrders = [...orders].sort((a, b) => {
    const da = new Date(a.created_at);
    const db = new Date(b.created_at);
    return sortAsc ? da - db : db - da;
  });

  const totalPages = Math.ceil(sortedOrders.length / PAGE_SIZE);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-gray-800">Order List</h2>
        <button
          onClick={() => setSortAsc(prev => !prev)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Sort by Date: {sortAsc ? 'ASC' : 'DESC'}
        </button>
      </div>

      <table className="min-w-full border text-sm md:text-base">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-2">#</th>
            <th className="border px-2 py-2">Customer</th>
            <th className="border px-2 py-2">Email</th>
            <th className="border px-2 py-2">Phone</th>
            <th className="border px-2 py-2">Address</th>
            <th className="border px-2 py-2">Status</th>
            <th className="border px-2 py-2">Created</th>
            <th className="border px-2 py-2">Processed</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order, i) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="border px-2 py-1 text-center">{order.id}</td>
              <td className="border px-2 py-1">{order.customer_firstname} {order.customer_lastname}</td>
              <td className="border px-2 py-1">{order.customer_email}</td>
              <td className="border px-2 py-1">{order.customer_phone}</td>
              <td className="border px-2 py-1">{order.customer_address}</td>
              <td className="border px-2 py-1">{order.status}</td>
              <td className="border px-2 py-1">{order.created_at}</td>
              <td className="border px-2 py-1">{order.processed_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center items-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
