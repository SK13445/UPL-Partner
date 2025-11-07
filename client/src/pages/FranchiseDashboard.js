import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { FaHome, FaUser, FaFileContract, FaPrint } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axios';

const FranchiseDashboardHome = () => {
  const [franchise, setFranchise] = useState(null);
  const [agreementStatus, setAgreementStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  useEffect(() => {
    fetchFranchiseData();
    fetchAgreementStatus();
  }, []);

  const fetchFranchiseData = async () => {
    try {
      const res = await api.get('/user/franchise/details');
      setFranchise(res.data.franchise);
    } catch (error) {
      toast.error('Failed to load franchise data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgreementStatus = async () => {
    try {
      const res = await api.get('/agreement/status');
      setAgreementStatus(res.data);
      setAgreementAccepted(res.data.agreementStatus === 'accepted');
    } catch (error) {
      console.error('Failed to load agreement status');
    }
  };

  const handleAcceptAgreement = async () => {
    try {
      await api.post('/agreement/accept');
      toast.success('Agreement accepted successfully!');
      setAgreementAccepted(true);
      setShowAgreementModal(false);
      fetchAgreementStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept agreement');
    }
  };

  const handlePrintAgreement = () => {
    if (franchise?._id) {
      window.open(`/agreement/print/${franchise._id}`, '_blank');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const steps = [
    {
      id: 1,
      title: 'Complete Profile',
      status: franchise?.profileStatus === 'complete' ? 'complete' : 'pending',
      component: <ProfileForm franchise={franchise} onUpdate={fetchFranchiseData} />
    },
    {
      id: 2,
      title: 'Accept Agreement',
      status: agreementAccepted ? 'complete' : franchise?.profileStatus === 'complete' ? 'pending' : 'locked',
      component: <AgreementSection
        franchise={franchise}
        agreementStatus={agreementStatus}
        onAccept={() => setShowAgreementModal(true)}
        onPrint={handlePrintAgreement}
        accepted={agreementAccepted}
      />
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {franchise?.ownerName || 'Partner'}!</h2>
        <p className="text-gray-600">Franchise Code: <span className="font-semibold">{franchise?.franchiseCode}</span></p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step.status === 'complete' ? 'bg-green-500 text-white' :
                step.status === 'pending' ? 'bg-yellow-500 text-white' :
                'bg-gray-300 text-gray-600'
              }`}>
                {step.status === 'complete' ? '✓' : step.id}
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${
                  step.status === 'complete' ? 'text-green-600' :
                  step.status === 'pending' ? 'text-yellow-600' :
                  'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  steps[index + 1].status === 'complete' || step.status === 'complete' 
                    ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      {steps.map((step) => {
        if (step.status === 'locked') return null;
        if (step.status === 'complete' && step.id === 1) return null; // Skip completed profile
        if (step.status === 'complete' && step.id === 2 && agreementAccepted) {
          return (
            <div key={step.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              {step.component}
            </div>
          );
        }
        if (step.status === 'pending') {
          return (
            <div key={step.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              {step.component}
            </div>
          );
        }
        return null;
      })}

      {/* Agreement Modal */}
      {showAgreementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Terms and Conditions Agreement</h3>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
              <h4 className="font-semibold mb-2">1. Franchise Obligations</h4>
              <p className="mb-4 text-sm">The Franchise agrees to operate the business in accordance with the standards set by the Company.</p>
              
              <h4 className="font-semibold mb-2">2. Confidentiality</h4>
              <p className="mb-4 text-sm">The Franchise shall maintain confidentiality of all proprietary information.</p>
              
              <h4 className="font-semibold mb-2">3. Fees and Royalties</h4>
              <p className="mb-4 text-sm">The Franchise agrees to pay all applicable fees and royalties as per the schedule.</p>
              
              <h4 className="font-semibold mb-2">4. Termination</h4>
              <p className="mb-4 text-sm">The Company reserves the right to terminate this agreement in case of breach of terms.</p>
              
              <h4 className="font-semibold mb-2">5. Compliance</h4>
              <p className="mb-4 text-sm">The Franchise shall comply with all local, state, and federal laws and regulations.</p>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                  className="mr-2"
                />
                <span>I agree to the terms and conditions</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAcceptAgreement}
                disabled={!agreementAccepted}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                Accept Offer
              </button>
              <button
                onClick={() => setShowAgreementModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileForm = ({ franchise, onUpdate }) => {
  const [formData, setFormData] = useState({
    ownerName: franchise?.ownerName || '',
    businessName: franchise?.businessName || '',
    address: {
      street: franchise?.address?.street || '',
      city: franchise?.address?.city || '',
      state: franchise?.address?.state || '',
      pincode: franchise?.address?.pincode || ''
    },
    idProof: {
      type: franchise?.idProof?.type || 'aadhar',
      number: franchise?.idProof?.number || ''
    },
    businessDetails: franchise?.businessDetails || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/user/franchise/submit-details', formData);
      toast.success('Profile updated successfully!');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
        <input
          type="text"
          name="address.street"
          value={formData.address.street}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <input
            type="text"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
          <input
            type="text"
            name="address.pincode"
            value={formData.address.pincode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof Type *</label>
          <select
            name="idProof.type"
            value={formData.idProof.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="aadhar">Aadhar</option>
            <option value="pan">PAN</option>
            <option value="passport">Passport</option>
            <option value="driving_license">Driving License</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof Number *</label>
          <input
            type="text"
            name="idProof.number"
            value={formData.idProof.number}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Business Details</label>
        <textarea
          name="businessDetails"
          value={formData.businessDetails}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
};

const AgreementSection = ({ franchise, agreementStatus, onAccept, onPrint, accepted }) => {
  return (
    <div>
      {accepted ? (
        <div>
          <p className="text-green-600 mb-4">✓ Agreement accepted on {new Date(agreementStatus?.agreementAcceptedAt).toLocaleDateString()}</p>
          <button
            onClick={onPrint}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition flex items-center"
          >
            <FaPrint className="mr-2" />
            Print Agreement
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">Please review and accept the agreement to proceed.</p>
          <button
            onClick={onAccept}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
          >
            View & Accept Agreement
          </button>
        </div>
      )}
    </div>
  );
};

const FranchiseDashboard = () => {
  const navItems = [
    { path: '/franchise', label: 'Dashboard', icon: FaHome },
  ];

  return (
    <DashboardLayout title="Franchise Dashboard" navItems={navItems}>
      <Routes>
        <Route path="/" element={<FranchiseDashboardHome />} />
      </Routes>
    </DashboardLayout>
  );
};

export default FranchiseDashboard;

