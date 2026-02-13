import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { Package, LayoutDashboard, ShoppingBag, LogOut } from "lucide-react";

export default function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
const isActive = (path: string) => location.pathname === path;
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

 return (
    <nav className="h-16 px-8 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm shadow-slate-100/50">
      {/* Left: Brand / Logo */}
      <div className="flex items-center gap-8">
        <Link
          to="/orders"
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-200 transition-transform group-hover:scale-105">
            <Package size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            MyApp<span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink 
            to="/orders" 
            active={isActive("/orders")} 
            icon={<LayoutDashboard size={18} />} 
            label="Orders List" 
          />
          <NavLink 
            to="/catalog" 
            active={isActive("/catalog")} 
            icon={<ShoppingBag size={18} />} 
            label="Catalog" 
          />
        </div>
      </div>

      {/* Right: User Actions */}
      <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
        <div className="flex-col items-end mr-2 hidden sm:flex">
          <span className="text-xs font-bold text-slate-900 leading-none">Aravinth</span>
          <span className="text-[10px] text-slate-400 font-medium mt-1">Customer</span>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all active:scale-95 border border-rose-100/50"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}

// Helper component for cleaner link styling
function NavLink({ to, active, icon, label }: { to: string; active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
        ${active 
          ? "text-blue-600 bg-blue-50/50" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
      `}
    >
      {icon}
      {label}
    </Link>
  );
}
