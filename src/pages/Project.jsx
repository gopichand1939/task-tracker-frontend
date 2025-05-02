import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiFilter, FiTrash2, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        // Fetch project details
        const projectRes = await axios.get(`/api/projects/${id}`);
        setProject(projectRes.data);

        // Fetch tasks
        const url = statusFilter
          ? `/api/tasks/${id}?status=${statusFilter}`
          : `/api/tasks/${id}`;
        const tasksRes = await axios.get(url);
        setTasks(tasksRes.data);
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error fetching project or tasks';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndTasks();
  }, [id, statusFilter]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`/api/tasks/${id}`, newTask);
      setTasks([...tasks, res.data]);
      setNewTask({ title: '', description: '' });
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Task creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map((task) => (task._id === taskId ? res.data : task)));
      toast.success('Task status updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-blue-600 hover:underline"
        >
          <FiArrowLeft className="mr-1" /> Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FiFolder className="mr-2" /> Tasks for {project ? project.name : `Project ID: ${id}`}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiPlus className="mr-2" /> Add New Task
        </h2>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Task description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiFilter className="mr-2" /> All Tasks
          </h2>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-600">No tasks found. Add a new task to get started!</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <h3 className="font-bold text-gray-800">{task.title}</h3>
                <p className="text-gray-600">{task.description || 'No description'}</p>
                <p className="text-sm text-gray-500">Status: {task.status}</p>
                {task.completedAt && (
                  <p className="text-sm text-green-600 flex items-center">
                    <FiCheckCircle className="mr-1" />
                    Completed At: {new Date(task.completedAt).toLocaleString()}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="flex items-center bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                  >
                    <FiTrash2 className="mr-1" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}