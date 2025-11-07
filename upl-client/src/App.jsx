import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";
import api from "./utils/axios";
import { setCredentials, logout } from "./store/slices/authSlice";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import EnquiryForm from "./pages/EnquiryForm";
import AdminDashboard from "./pages/AdminDashboard";
import HRDashboard from "./pages/HRDashboard";
import OperationalDashboard from "./pages/OperationalDashboard";
import FranchiseDashboard from "./pages/FranchiseDashboard";
import AgreementPrint from "./pages/AgreementPrint";
import Unauthorized from "./pages/Unauthorized";
import ChannelPartnerDashboard from "./pages/ChannelPartnerDashboard";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Verify token on mount
    if (token) {
      api
        .get("/auth/me")
        .then((res) => {
          dispatch(
            setCredentials({
              user: res.data.user,
              token,
            })
          );
        })
        .catch(() => {
          dispatch(logout());
        });
    }
  }, [dispatch, token]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/enquiry" element={<EnquiryForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/hr/*"
        element={
          <PrivateRoute allowedRoles={["hr"]}>
            <HRDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/operational/*"
        element={
          <PrivateRoute allowedRoles={["operational_head"]}>
            <OperationalDashboard />
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/franchise/*"
        element={
          <PrivateRoute allowedRoles={["franchise_partner"]}>
            <FranchiseDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/channel-partner/*"
        element={
          <PrivateRoute allowedRoles={["channel_partner"]}>
            <ChannelPartnerDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/agreement/print/:id"
        element={
          <PrivateRoute>
            <AgreementPrint />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
