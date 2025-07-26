import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col">
      <nav className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center mb-8">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveSection('home')}
            className={`cursor-pointer text-gray-700 font-semibold transition hover:text-indigo-600
              ${activeSection === 'home' ? 'underline decoration-indigo-600 underline-offset-4' : ''}
            `}
          >
            Home
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className={`cursor-pointer text-gray-700 font-semibold transition hover:text-indigo-600
              ${activeSection === 'settings' ? 'underline decoration-indigo-600 underline-offset-4' : ''}
            `}
          >
            Settings
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-5 rounded-xl transition cursor-pointer"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8 flex-grow">
        {activeSection === 'home' && (
          <div className="home">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard - Početna</h1>
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
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="settings">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-gray-600 mb-6">
              here you can configure
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
