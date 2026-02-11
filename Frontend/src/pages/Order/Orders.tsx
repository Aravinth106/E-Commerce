import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder} from "../../services/orderService";
import type { Order } from "../../types/order.types";
import { Search, ChevronDown, ListFilter, Calendar, Clock, Eye, Plus, XCircle } from "lucide-react"; 
import { useNavigate } from "react-router-dom";



export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cancellingId, setCancellingId] = useState<string | null>(null);


  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }
  

const handleCancel = async (orderId: string) => {
  const confirmed = window.confirm("Are you sure you want to cancel this order?");
  if (!confirmed) return;

  try {
    setCancellingId(orderId);
    await cancelOrder(orderId);
    await loadOrders(); // refresh list
  } catch (error) {
    console.error(error);
    alert("Failed to cancel order");
  } finally {
    setCancellingId(null);
  }
};

return (
  <div className="p-8 bg-slate-50/50 min-h-screen font-sans antialiased text-slate-900">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Order Management</h1>
        <p className="text-sm text-slate-500 mt-1">Manage, track, and analyze your sales orders.</p>
      </div>
      
      <button 
        onClick={() => navigate("/catalog")} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm shadow-blue-200 transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" />
        New Order
      </button>
    </div>

    {/* Main Table Container */}
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      
      {/* Table Toolbar */}
      <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-4 bg-white">
        <h2 className="text-lg font-bold text-slate-800 hidden md:block">Orders List</h2>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Bar - Refined with focus-ring styling */}
          <div className="relative grow md:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by ID, customer, or product..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <span>Sort: <span className="text-slate-900">Recent</span></span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <button className="p-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-100">
              <ListFilter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Table Layout */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-widest border-b border-slate-100">
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4">Order Date</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.orderId} className="group hover:bg-blue-50/30 transition-all duration-200">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors uppercase text-sm">
                      {order.items[0]?.productName || "General Order"}
                    </span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                        {order.items.length} {order.items.length === 1 ? 'ITEM' : 'ITEMS'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">#{order.orderId.slice(-6)}</span>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </td>
    
                <td className="px-6 py-5">
                  <div className="text-[15px] font-bold text-slate-900">
                    ₦ {order.totalAmount.toLocaleString()}
                  </div>
                </td>
                
                <td className="px-6 py-5">
                  <div className={`
                    px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center w-fit gap-2 border
                    ${order.status === 'Paid' 
                      ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                      : "text-amber-700 bg-amber-50 border-amber-100"}
                  `}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${order.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    {order.status.toUpperCase()}
                  </div>
                </td>

                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </button>

                    {order.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(order.orderId)}
                        disabled={cancellingId === order.orderId}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold disabled:opacity-50"
                        title="Cancel Order"
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {cancellingId === order.orderId ? "..." : "Cancel"}
                        </span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center bg-white">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-slate-900 font-bold">No orders found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  </div>
);
}

