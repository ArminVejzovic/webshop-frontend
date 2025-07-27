import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeArticles from '../components/HomeArticles';
import AddArticleForm from '../components/AddArticleForm';
import OrdersList from '../components/OrdersList';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    if (location.state?.section) {
      setActiveSection(location.state.section);
    }
  }, [location.state]);

  const menuItems = [
    { key: 'home', label: 'Home' },
    { key: 'add-article', label: 'Add New Article' },
    { key: 'orders', label: 'Orders' },
    { key: 'settings', label: 'Settings' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col">
      <nav className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center mb-8">
        <div className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`cursor-pointer text-gray-700 font-semibold transition hover:text-indigo-600
                ${activeSection === item.key ? 'underline decoration-indigo-600 underline-offset-4' : ''}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="md:hidden relative" ref={dropdownRef}>
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="cursor-pointer"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  isMobileMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </svg>
          </button>

          {isMobileMenuOpen && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-xl p-4 z-50 space-y-2 w-40">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveSection(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left font-medium transition ${
                    activeSection === item.key
                      ? 'text-indigo-600 underline underline-offset-4'
                      : 'text-gray-700 hover:text-indigo-600'
                  } cursor-pointer`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl transition cursor-pointer text-sm"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6 flex-grow w-full">
        {activeSection === 'home' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Home
            </h1>
            <p className="text-gray-600 mb-6">Welcome, admin!</p>
            <p className="text-2xl pb-4  font-bold text-center text-gray-600">Articles</p>
            <HomeArticles />
          </div>
        )}

        {activeSection === 'add-article' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Add New Article</h1>
            <p className="text-gray-600">Product input form goes here.</p>
            <AddArticleForm />
          </div>
        )}

        {activeSection === 'orders' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Orders</h1>
            <OrdersList />
          </div>
        )}

        {activeSection === 'settings' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Settings</h1>
            <p className="text-gray-600">Here you can change your settigs.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
