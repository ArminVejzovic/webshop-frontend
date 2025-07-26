import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-6 text-center">
      <h1 className="text-5xl font-extrabold drop-shadow-lg mb-8">
        Welcome to Mini Webshop
      </h1>

      <div className="flex flex-wrap gap-6 justify-center max-w-md w-full">
        <button
          onClick={() => navigate('/login')}
          className="flex-1 min-w-[150px] bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg shadow-lg transition-colors duration-300"
        >
          Login as Admin
        </button>

        <button
          onClick={() => alert('Guest feature coming soon!')}
          className="flex-1 min-w-[150px] bg-green-400 hover:bg-green-500 text-gray-900 font-semibold py-3 rounded-lg shadow-lg transition-colors duration-300"
        >
          Login as Webshop Guest
        </button>
      </div>
    </div>
  );
}

export default Landing;
