import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import type { Order } from "../../types/order.types";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null as Order | null);
  const [loading, setLoading] = useState(true);

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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Order Details</h1>

      {/* Order Summary */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <p><b>Order ID:</b> {order.orderId}</p>
        <p><b>Date:</b> {new Date(order.orderDate).toLocaleString()}</p>
        <p>
          <b>Status:</b>{" "}
          <span className="px-2 py-1 rounded bg-gray-100">
            {order.status}
          </span>
        </p>
        <p className="mt-2 text-lg font-semibold">
          Total: ₹{order.totalAmount}
        </p>
      </div>

      {/* Items */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Items</h2>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId} className="border-t">
                <td className="p-2">{item.productName}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-right">₹{item.price}</td>
                <td className="p-2 text-right">
                  ₹{item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;
