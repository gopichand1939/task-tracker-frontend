// File: src/components/Navbar.jsx
import useAuth from '../hooks/useAuth'; // ✅ updated import
import { useNavigate, NavLink } from 'react-router-dom';
import { FiLogOut, FiHome, FiActivity } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">Task Tracker</span>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <FiHome className="mr-2" /> Dashboard
              </NavLink>
              <NavLink
                to="/logs"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <FiActivity className="mr-2" /> Logs
              </NavLink>
              <span className="text-gray-600">{user.name || user._id}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
