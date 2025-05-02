// File: src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // ✅ updated import
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiUsers, FiFolder } from 'react-icons/fi';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects');
        setProjects(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error fetching projects');
        console.error('Fetch projects error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.trim()) {
      toast.error('Project name is required');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/projects', { name: newProject });
      setProjects([...projects, res.data]);
      setNewProject('');
      toast.success('Project created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (projectId) => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    setInviteLoading(true);
    try {
      await axios.post(`/api/projects/invite/${projectId}`, { email: inviteEmail });
      setInviteEmail('');
      toast.success('User invited successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite user');
    } finally {
      setInviteLoading(false);
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <FiFolder className="mr-2" /> Welcome, {user.name || user._id}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiPlus className="mr-2" /> Create New Project
        </h2>
        <form onSubmit={handleCreateProject} className="flex gap-2">
          <input
            type="text"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            placeholder="New project name"
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiFolder className="mr-2" /> My Projects
        </h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <p className="text-gray-600">No projects found. Create a new project to get started!</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li
                key={project._id}
                className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-center">
                  <Link
                    to={`/project/${project._id}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {project.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="Invite user by email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleInviteUser(project._id)}
                      disabled={inviteLoading}
                      className={`flex items-center bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition ${
                        inviteLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <FiUsers className="mr-1" />
                      {inviteLoading ? 'Inviting...' : 'Invite'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
