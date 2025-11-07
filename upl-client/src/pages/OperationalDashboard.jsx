import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { FaHome, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axios";

const OperationalDashboardHome = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("enquiries");
  const [franchiseAccount, setFranchiseAccount] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enquiriesRes, franchisesRes] = await Promise.all([
        api.get("/franchise/enquiry/pending?role=operational_head"),
        api.get("/franchise/list"),
      ]);

      setEnquiries(enquiriesRes.data.enquiries);
      setFranchises(franchisesRes.data.franchises);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enquiryId) => {
    try {
      const res = await api.post(`/franchise/approve/${enquiryId}`, { notes });

      if (res.data.franchise) {
        setFranchiseAccount({
          email: res.data.franchise.email,
          franchiseCode: res.data.franchise.franchiseCode,
          tempPassword: res.data.franchise.tempPassword,
        });
      }

      toast.success("Enquiry approved successfully");
      setSelectedEnquiry(null);
      setNotes("");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve enquiry");
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      {/* TABS */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "enquiries"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending Approvals
          </button>

          <button
            onClick={() => setActiveTab("franchises")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "franchises"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Franchises
          </button>
        </nav>
      </div>

      {/* ENQUIRIES LIST */}
      {activeTab === "enquiries" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              HR Approved Enquiries
            </h2>
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
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry._id}>
                      <td className="px-6 py-4 text-sm font-medium">
                        {enquiry.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {enquiry.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {enquiry.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {enquiry.location}
                      </td>
                      <td className="px-6 py-4 text-sm">
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

      {/* FRANCHISE LIST */}
      {activeTab === "franchises" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              All Franchises
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Owner Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    Location
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {franchises.map((franchise) => (
                  <tr key={franchise._id}>
                    <td className="px-6 py-4 text-sm font-medium">
                      {franchise.franchiseCode}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {franchise.businessName || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {franchise.ownerName || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {franchise.email || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {franchise.phone || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {franchise.location || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FINAL APPROVAL MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Final Approval</h3>

            <p className="mb-2">
              <b>Name:</b> {selectedEnquiry.name}
            </p>
            <p className="mb-2">
              <b>Email:</b> {selectedEnquiry.email}
            </p>
            <p className="mb-4">
              <b>Location:</b> {selectedEnquiry.location}
            </p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full border p-2 rounded mb-4"
              placeholder="Notes (Optional)"
            />

            <div className="flex gap-4">
              <button
                onClick={() => handleApprove(selectedEnquiry._id)}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                <FaCheckCircle className="inline mr-2" /> Final Approve
              </button>

              <button
                onClick={() => toast.error("Reject route not implemented yet")}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                <FaTimesCircle className="inline mr-2" /> Reject
              </button>
            </div>

            <button
              onClick={() => setSelectedEnquiry(null)}
              className="w-full border py-2 rounded mt-3"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FRANCHISE ACCOUNT CREATED MODAL */}
      {franchiseAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-green-600">
              ✓ Franchise Account Created
            </h3>

            <div className="space-y-3 mb-4">
              <p>
                <b>Email:</b> {franchiseAccount.email}
              </p>
              <p>
                <b>Temporary Password:</b> {franchiseAccount.tempPassword}
              </p>
              <p>
                <b>Franchise Code:</b> {franchiseAccount.franchiseCode}
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `Email: ${franchiseAccount.email}\nPassword: ${franchiseAccount.tempPassword}\nFranchise Code: ${franchiseAccount.franchiseCode}`
                );
                toast.success("Credentials copied!");
              }}
              className="w-full bg-indigo-600 text-white py-2 rounded mb-3 hover:bg-indigo-700"
            >
              Copy Credentials
            </button>

            <button
              onClick={() => setFranchiseAccount(null)}
              className="w-full border py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const OperationalDashboard = () => {
  return (
    <DashboardLayout title="Operational Head Dashboard">
      <Routes>
        <Route path="/" element={<OperationalDashboardHome />} />
      </Routes>
    </DashboardLayout>
  );
};

export default OperationalDashboard;
