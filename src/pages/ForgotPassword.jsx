import { useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      toast.success('Reset token sent! Check your email (or use the token in reset password).');
      console.log('Reset Token:', res.data.resetToken); // For testing
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiMail className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending...' : 'Send Reset Token'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}