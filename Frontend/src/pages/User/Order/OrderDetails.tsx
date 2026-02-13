import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../../services/orderService";
import type { Order } from "../../../types/order.types";
import { ArrowLeft, Printer, Download, Package, Tag, Hash, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null as Order | null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrder = async () => {
      
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6">Order not found</p>;

 return (
  <div className="p-8 bg-slate-50/50 min-h-screen font-sans antialiased text-slate-900">
    {/* Navigation & Actions Header */}
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Order Details</h1>
          <p className="text-sm text-slate-500 font-medium">Viewing details for order #{order.orderId.slice(-8)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
          <Printer size={16} />
          Print Invoice
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
          <Download size={16} />
          Export PDF
        </button>
      </div>
    </div>

    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT: Items Table (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-slate-800">Order Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4 text-right">Unit Price</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <tr key={item.productId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-800">{item.productName}</span>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-tighter">SKU-{item.productId.slice(-5)}</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-medium text-slate-600">
                      ₦ {item.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-slate-900">
                      ₦ {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Internal Footer for calculation summary */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
             <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span>₦ {order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 font-medium">
                  <span>Tax (0%)</span>
                  <span>₦ 0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₦ {order.totalAmount.toLocaleString()}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Order Summary Card (1/3 width) */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-500" />
            Summary
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Hash size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</p>
                <p className="text-sm font-bold text-slate-800 break-all">{order.orderId}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Date</p>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(order.orderDate).toLocaleDateString('en-GB', { 
                    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Status</p>
              <div className={`
                px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border
                ${order.status === 'Paid' 
                  ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                  : "text-amber-700 bg-amber-50 border-amber-100"}
              `}>
                <span className={`w-2 h-2 rounded-full ${order.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                {order.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Message Card */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-100">
          <h3 className="font-bold mb-1">Customer Support</h3>
          <p className="text-blue-100 text-xs leading-relaxed">Need help with this order? Contact our support team for assistance with returns or billing issues.</p>
          <button className="mt-4 w-full bg-white/10 hover:bg-white/20 transition-colors py-2 rounded-lg text-xs font-bold border border-white/20">
            Contact Support
          </button>
        </div>
      </div>

    </div>
  </div>
);
};

export default OrderDetails;
