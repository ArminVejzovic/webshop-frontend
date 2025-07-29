import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin-dashboard');
    }
  }, []);

  const handleLogin = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
      const res = await axios.post(
				`${BACKEND_URL}/login`,
				{ username, password },
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			);
      localStorage.setItem('token', res.data.access_token);
      navigate('/admin-dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        {error && (
          <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition-colors cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
