import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import {
  FaSignOutAlt,
  FaUser,
  FaTachometerAlt,
  FaUsers,
  FaList,
  FaPlus,
} from "react-icons/fa";

const DashboardLayout = ({ children, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Role labels
  const getRoleLabel = (role) => {
    const labels = {
      admin: "Admin",
      hr: "HR",
      operational_head: "Operational Head",
      franchise_partner: "Franchise Partner",
      channel_partner: "Channel Partner",
    };
    return labels[role] || role;
  };

  // ✅ Navigation Menu Config (must be ABOVE navItems usage!)
  const menus = {
    admin: [
      { label: "Dashboard", path: "/admin", icon: FaTachometerAlt },
      { label: "Users", path: "/admin/users", icon: FaUsers },
      { label: "Franchises", path: "/admin/franchises", icon: FaList },
    ],
    operational_head: [
      { label: "Dashboard", path: "/operational", icon: FaTachometerAlt },
      {
        label: "Approve Partners",
        path: "/operational/enquiries",
        icon: FaList,
      },
    ],
    hr: [
      { label: "Pending Enquiries", path: "/hr", icon: FaList },
      { label: "Add Partner ", path: "/hr/manual", icon: FaPlus },
    ],
    franchise_partner: [
      { label: "Dashboard", path: "/franchise", icon: FaTachometerAlt },
    ],
    channel_partner: [
      { label: "Dashboard", path: "/channel", icon: FaTachometerAlt },
    ],
  };

  // ✅ Pick correct menu for current user
  const navItems = menus[user?.role] || [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-indigo-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">UPL Partner</h2>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  location.pathname === item.path
                    ? "bg-indigo-700"
                    : "hover:bg-indigo-800"
                }`}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-indigo-800">
          <div className="flex items-center space-x-3 mb-4">
            <FaUser className="text-xl" />
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-indigo-300">
                {getRoleLabel(user?.role)}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 bg-indigo-800 hover:bg-indigo-700 rounded-lg transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Layout */}
      <div className="ml-64">
        <header className="bg-white shadow-sm px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
