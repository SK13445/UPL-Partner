import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { FaHome, FaList, FaCheckCircle, FaTimesCircle, FaChartBar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axios';

const OperationalDashboardHome = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('enquiries');
  const [franchiseAccount, setFranchiseAccount] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enquiriesRes, franchisesRes] = await Promise.all([
        api.get('/franchise/enquiry/pending?role=operational_head'),
        api.get('/franchise/list')
      ]);
      setEnquiries(enquiriesRes.data.enquiries);
      setFranchises(franchisesRes.data.franchises);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enquiryId, action) => {
    try {
      const res = await api.post('/franchise/approve', {
        enquiryId,
        action,
        notes
      });
      
      if (action === 'approve' && res.data.franchiseAccount) {
        setFranchiseAccount(res.data.franchiseAccount);
        toast.success('Franchise account created successfully!');
      } else {
        toast.success(`Enquiry ${action}d successfully`);
      }
      
      setSelectedEnquiry(null);
      setNotes('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process enquiry');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'enquiries'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Approvals
            </button>
            <button
              onClick={() => setActiveTab('franchises')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'franchises'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Franchises
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">HR Approved Enquiries</h2>
          </div>
          
          {enquiries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No pending approvals
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {enquiry.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enquiry.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enquiry.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enquiry.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'franchises' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Franchises</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {franchises.map((franchise) => (
                  <tr key={franchise._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {franchise.franchiseCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {franchise.businessName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {franchise.ownerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {franchise.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        franchise.agreementStatus === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : franchise.agreementStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {franchise.agreementStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Final Approval</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Name:</label>
                <p className="text-gray-900">{selectedEnquiry.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email:</label>
                <p className="text-gray-900">{selectedEnquiry.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Location:</label>
                <p className="text-gray-900">{selectedEnquiry.location}</p>
              </div>
              {selectedEnquiry.hrNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">HR Notes:</label>
                  <p className="text-gray-900">{selectedEnquiry.hrNotes}</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleApprove(selectedEnquiry._id, 'approve')}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                <FaCheckCircle className="inline mr-2" />
                Final Approve
              </button>
              <button
                onClick={() => handleApprove(selectedEnquiry._id, 'reject')}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
              >
                <FaTimesCircle className="inline mr-2" />
                Reject
              </button>
              <button
                onClick={() => {
                  setSelectedEnquiry(null);
                  setNotes('');
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Franchise Account Credentials Modal */}
      {franchiseAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-green-600">✓ Franchise Account Created</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Share these credentials with the franchise partner:
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Email:</label>
                  <p className="text-lg font-semibold text-gray-900">{franchiseAccount.email}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500">Temporary Password:</label>
                  <p className="text-lg font-mono font-semibold text-indigo-600 bg-white p-2 rounded border">
                    {franchiseAccount.tempPassword}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500">Franchise Code:</label>
                  <p className="text-lg font-semibold text-gray-900">{franchiseAccount.franchiseCode}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Email: ${franchiseAccount.email}\nPassword: ${franchiseAccount.tempPassword}\nFranchise Code: ${franchiseAccount.franchiseCode}`
                  );
                  toast.success('Credentials copied to clipboard!');
                }}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
              >
                Copy Credentials
              </button>
              <button
                onClick={() => setFranchiseAccount(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OperationalDashboard = () => {
  const navItems = [
    { path: '/operational', label: 'Dashboard', icon: FaHome },
  ];

  return (
    <DashboardLayout title="Operational Head Dashboard" navItems={navItems}>
      <Routes>
        <Route path="/" element={<OperationalDashboardHome />} />
      </Routes>
    </DashboardLayout>
  );
};

export default OperationalDashboard;

