import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="h-14 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
      {/* Left: Logo */}
      <Link
        to="/orders"
        className="text-lg font-semibold text-gray-900 hover:text-gray-700"
      >
        MyApp
      </Link>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        <Link
          to="/orders"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Orders List
        </Link>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
