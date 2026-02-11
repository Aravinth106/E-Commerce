import { useAuthStore } from "../store/auth.store";

const AdminHeader = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="h-16 bg-white shadow flex items-center justify-end px-6">
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminHeader;
