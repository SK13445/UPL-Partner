import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";

const HRManualPartner = () => {
  const [manualData, setManualData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
  });

  const [notes, setNotes] = useState("");

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
      setManualData({ name: "", email: "", phone: "", location: "", role: "" });
      setNotes("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create partner");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Add Partner Manually</h2>

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
        onChange={(e) => setManualData({ ...manualData, role: e.target.value })}
      >
        <option value="">Select Partner Type</option>
        <option value="franchise_partner">Franchise Partner</option>
        <option value="channel_partner">Channel Partner</option>
      </select>

      <textarea
        className="w-full mt-4 border p-2 rounded"
        placeholder="Notes (optional)"
        rows="3"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={handleManualCreate}
        className="w-full bg-indigo-600 text-white py-2 rounded mt-4 hover:bg-indigo-700"
      >
        Save Partner
      </button>
    </div>
  );
};

export default HRManualPartner;
