import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

      <nav className="space-y-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `block px-3 py-2 rounded ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `block px-3 py-2 rounded ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          Categories
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `block px-3 py-2 rounded ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `block px-3 py-2 rounded ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          Orders
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
