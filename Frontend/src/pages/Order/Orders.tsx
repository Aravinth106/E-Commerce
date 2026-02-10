import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder} from "../../services/orderService";
import type { Order } from "../../types/order.types";
import { Search, ChevronDown, ListFilter } from "lucide-react"; 
import { useNavigate } from "react-router-dom";


const statusColor: Record<string, string> = {
  Paid: "text-green-600 bg-green-50",
  Shipped: "text-green-600 bg-green-50",
  Pending: "text-orange-500 bg-orange-50",
  Cancelled: "text-red-600 bg-red-50",
};

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
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium text-gray-700">Order Management</h1>
        <button   onClick={() => navigate("/orders/create")} className="bg-[#1a56db] hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
          <span className="text-lg">+</span> New Order
        </button>
      </div>


      {/* Orders Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">List of Orders</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search orders" 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white">
              <span>Sort By</span>
              <span className="font-medium text-gray-900">Recent</span>
              <ChevronDown className="w-4 h-4" />
            </div>

            {/* Filter Button */}
            <button className="p-2 bg-[#1a56db] text-white rounded-lg">
              <ListFilter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Time stamp</th>
                {/* <th className="px-6 py-4">Customer</th> */}
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-semibold text-gray-900">{order.orderId}</div>
                    <div className="text-xs text-gray-400 mt-1 font-medium">Total Items: <span className="text-gray-900">{order.items.length}</span></div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600">
                    {/* Example formatting to match screenshot style */}
                    {new Date(order.orderDate).toLocaleDateString()} <span className="ml-2">{new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  {/* <td className="px-6 py-5 text-sm font-medium text-gray-900">
                    Aisha Abubakar
                  </td> */}
                  <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                    ₦ {order.totalAmount.toLocaleString()}
                  </td>
                  
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center w-fit gap-1.5 ${statusColor[order.status] || "text-gray-600 bg-gray-100"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Paid' ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right space-x-4">
  <button
    onClick={() => navigate(`/orders/${order.orderId}`)}
    className="text-[#1a56db] text-sm font-semibold hover:underline"
  >
    View order
  </button>

  {order.status === "Pending" && (
    <button
      onClick={() => handleCancel(order.orderId)}
      disabled={cancellingId === order.orderId}
      className="text-red-600 text-sm font-semibold hover:underline disabled:opacity-50"
    >
      {cancellingId === order.orderId ? "Cancelling..." : "Cancel"}
    </button>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="p-10 text-center text-gray-400 bg-white">
            No orders found in this period.
          </div>
        )}
      </div>
    </div>
  );
}

