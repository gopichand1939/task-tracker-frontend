import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { FiActivity } from 'react-icons/fi';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/logs');
        setLogs(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error fetching logs');
        console.error('Fetch logs error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <FiActivity className="mr-2" /> Activity Logs
      </h1>
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : logs.length === 0 ? (
        <p className="text-gray-600">No logs yet.</p>
      ) : (
        <ul className="space-y-4">
          {logs.map((log) => (
            <li
              key={log._id}
              className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <p className="font-semibold">
                <span className="text-gray-700">Action:</span> {log.action}
              </p>
              <p>
                <span className="text-gray-700">Target:</span> {log.targetType} – {log.targetId}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}