import { Routes, Route, } from "react-router-dom";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Orders from "../pages/Order/Orders";
import OrderDetails from "../pages/Order/OrderDetails";
import CreateOrder from "../pages/Order/CreateOrder";
import AppLayout from "../AppLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected layout */}
      <Route element={<AppLayout />}>
        <Route path="/orders" element={<ProtectedRoute> <Orders /> </ProtectedRoute>}/>

        <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute> }/>

        <Route path="/orders/create" element={<ProtectedRoute><CreateOrder /></ProtectedRoute>} />
      </Route>

      {/* Redirect root */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
