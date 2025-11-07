import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { FaHome, FaUsers, FaChartBar, FaFileAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axios';

const AdminDashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.statistics);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const statCards = [
    { label: 'Total Enquiries', value: stats?.totalEnquiries || 0, color: 'blue' },
    { label: 'Pending Enquiries', value: stats?.pendingEnquiries || 0, color: 'yellow' },
    { label: 'Approved Enquiries', value: stats?.approvedEnquiries || 0, color: 'green' },
    { label: 'Total Franchises', value: stats?.totalFranchises || 0, color: 'indigo' },
    { label: 'Active Franchises', value: stats?.activeFranchises || 0, color: 'green' },
    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'purple' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-lg shadow p-6 border-l-4 border-${stat.color}-500`}
          >
            <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data.users);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.role}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminDashboard = () => {
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: FaHome },
    { path: '/admin/users', label: 'Users', icon: FaUsers },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems}>
      <Routes>
        <Route path="/" element={<AdminDashboardHome />} />
        <Route path="/users" element={<AdminUsers />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;

