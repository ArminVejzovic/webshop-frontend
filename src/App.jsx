import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/AdminDashboard';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
