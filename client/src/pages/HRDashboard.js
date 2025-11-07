import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { FaList, FaCheckCircle, FaTimesCircle, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axios";

const HRDashboardHome = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [notes, setNotes] = useState("");

  const [manualData, setManualData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
  });

  const isManual = selectedEnquiry?.type === "manual";

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await api.get("/franchise/enquiry/pending?role=hr");
      setEnquiries(res.data.enquiries);
    } catch (error) {
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enquiryId, action) => {
    try {
      await api.post("/franchise/approve", {
        enquiryId,
        action,
        notes,
      });
      toast.success(`Enquiry ${action}d successfully`);
      setSelectedEnquiry(null);
      setNotes("");
      fetchEnquiries();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process enquiry");
    }
  };

  const handleManualCreate = async () => {
    if (
      !manualData.name ||
      !manualData.email ||
      !manualData.phone ||
      !manualData.location ||
      !manualData.role
    ) {
      return toast.error("All fields are required");
    }

    try {
      await api.post("/franchise/create-partner", {
        ...manualData,
        notes,
      });

      toast.success("Partner created successfully");
      setSelectedEnquiry(null);
      setNotes("");
      setManualData({ name: "", email: "", phone: "", location: "", role: "" });
      fetchEnquiries();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create partner");
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Pending Enquiries
          </h2>

          {/* NEW BUTTON */}
          <button
            onClick={() => setSelectedEnquiry({ type: "manual" })}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          >
            <FaPlus /> Add Partner Manually
          </button>
        </div>

        {enquiries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No pending enquiries
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
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
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(enquiry.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* MANUAL PARTNER CREATION */}
            {isManual ? (
              <>
                <h3 className="text-2xl font-bold mb-4">Create Partner</h3>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="border p-2 rounded"
                    placeholder="Name"
                    value={manualData.name}
                    onChange={(e) =>
                      setManualData({ ...manualData, name: e.target.value })
                    }
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="Email"
                    value={manualData.email}
                    onChange={(e) =>
                      setManualData({ ...manualData, email: e.target.value })
                    }
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="Phone"
                    value={manualData.phone}
                    onChange={(e) =>
                      setManualData({ ...manualData, phone: e.target.value })
                    }
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="Location"
                    value={manualData.location}
                    onChange={(e) =>
                      setManualData({ ...manualData, location: e.target.value })
                    }
                  />
                </div>

                <select
                  className="border p-2 rounded w-full mt-4"
                  value={manualData.role}
                  onChange={(e) =>
                    setManualData({ ...manualData, role: e.target.value })
                  }
                >
                  <option value="">Select Partner Type</option>
                  <option value="franchise_partner">Franchise Partner</option>
                  <option value="channel_partner">Channel Partner</option>
                </select>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full mt-4 border p-2 rounded"
                  placeholder="Notes (optional)"
                />

                <button
                  onClick={handleManualCreate}
                  className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700"
                >
                  Save Partner
                </button>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="w-full border py-2 rounded mt-3"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {/* ORIGINAL ENQUIRY VIEW REMAINS SAME */}
                <h3 className="text-2xl font-bold mb-4">Enquiry Details</h3>
                <p>
                  <b>Name:</b> {selectedEnquiry.name}
                </p>
                <p>
                  <b>Email:</b> {selectedEnquiry.email}
                </p>
                <p>
                  <b>Phone:</b> {selectedEnquiry.phone}
                </p>
                <p>
                  <b>Location:</b> {selectedEnquiry.location}
                </p>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full border p-2 rounded my-4"
                  placeholder="Notes"
                />

                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      handleApprove(selectedEnquiry._id, "approve")
                    }
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    <FaCheckCircle className="inline mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => handleApprove(selectedEnquiry._id, "reject")}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    <FaTimesCircle className="inline mr-1" /> Reject
                  </button>
                </div>

                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="w-full border py-2 rounded mt-3"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const HRDashboard = () => {
  const navItems = [{ path: "/hr", label: "Pending Enquiries", icon: FaList }];

  return (
    <DashboardLayout title="HR Dashboard" navItems={navItems}>
      <Routes>
        <Route path="/" element={<HRDashboardHome />} />
      </Routes>
    </DashboardLayout>
  );
};

export default HRDashboard;
