import Cookies from "js-cookie";

import AdminDashboard from "../../components/AdminDashboard";
import OwnerDashboard from "../../components/OwnerDashboard";
import UserDashboard from "../../components/UserDashboard";

import FailedView from "../../components/FailedView";

const Dashboard = () => {
  const role = Cookies.get("role");
  if (role === "admin") return <AdminDashboard />;
  if (role === "user") return <UserDashboard />;
  if (role === "owner") return <OwnerDashboard />;

  const error = `Unexpcted role value: ${role}`;

  return <FailedView error={error} />;
};

export default Dashboard;
