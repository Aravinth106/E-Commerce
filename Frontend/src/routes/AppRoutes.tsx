import { Routes, Route, } from "react-router-dom";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Orders from "../pages/Order/Orders";
import OrderDetails from "../pages/Order/OrderDetails";
import CreateOrder from "../pages/Order/CreateOrder";
import Catalog from "../pages/Catalog";
import AdminLayout from "../layouts/Adminlayouts";
import Categories from "../pages/Admin/Categories";
import UserLayout from "../layouts/UserLayout";

export default function AppRoutes() {
return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* USER ROUTES */}
      <Route
        element={
          <ProtectedRoute requiredRoles={["User"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/orders/create" element={<CreateOrder />} />
        <Route path="/catalog" element={<Catalog />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles={["Admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="categories" element={<Categories />} />
        {/* <Route path="products" element={<Products />} /> */}
      </Route>

      <Route path="/" element={<Login />} />

    </Routes>
  );
}
