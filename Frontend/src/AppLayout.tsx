import { Outlet } from "react-router-dom";
import Navbar from "../src/pages/Navbar";
import { useAuthStore } from "../src/store/auth.store";

export default function AppLayout() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Outlet />; // public pages, no navbar
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
