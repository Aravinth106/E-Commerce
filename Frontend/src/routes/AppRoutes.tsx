import { Routes, Route, } from "react-router-dom";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Orders from "../pages/User/Order/Orders";
import OrderDetails from "../pages/User/Order/OrderDetails";
import Catalog from "../pages/User/Catalog";
import AdminLayout from "../layouts/Adminlayouts";
import Categories from "../pages/Admin/Categories";
import UserLayout from "../layouts/UserLayout";
import PublicRoute from "./PublicRoute";
import Products from "../pages/Admin/Producsts";
import ProductForm from "../pages/Admin/ProductForm";

export default function AppRoutes() {
return (
    <Routes>
      {/* Public */}
  <Route
    path="/login"
    element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    }
  />

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
        <Route path="products" element={<Products />} />
        <Route path="products/create" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
      </Route>

      <Route path="/" element={<Login />} />

    </Routes>
  );
}
