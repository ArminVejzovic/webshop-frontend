import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome, admin!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => alert('Articles page coming soon!')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition cursor-pointer"
          >
            Get Articles
          </button>

          <button
            onClick={() => alert('Articles page coming soon!')}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition cursor-pointer"
          >
            Post Articles
          </button>

          <button
            onClick={() => alert('Orders page coming soon!')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-xl transition cursor-pointer"
          >
            Get Orders
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
