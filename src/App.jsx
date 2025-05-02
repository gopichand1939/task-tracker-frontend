import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Project from './pages/Project';
import Logs from './pages/Logs';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './routes/PrivateRoute';
import Navbar from './components/Navbar';

const PrivateLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/project/:id" element={<PrivateRoute><Project /></PrivateRoute>} />
          <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}