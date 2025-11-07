import DashboardLayout from "../components/DashboardLayout";

const ChannelPartnerDashboard = () => {
  return (
    <DashboardLayout title="Channel Partner Dashboard">
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome Channel Partner
        </h2>
        <p className="text-gray-600">Your dashboard view will come here.</p>
      </div>
    </DashboardLayout>
  );
};

export default ChannelPartnerDashboard;
