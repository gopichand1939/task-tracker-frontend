import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <FiAlertTriangle className="text-red-600 text-6xl mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/login"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Go back to Login
      </Link>
    </div>
  );
}