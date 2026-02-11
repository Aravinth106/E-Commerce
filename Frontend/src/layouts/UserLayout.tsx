import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";
import { useAuthStore } from "../store/auth.store";

export default function UserLayout() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Outlet />; 
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
