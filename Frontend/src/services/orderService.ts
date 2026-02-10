
import api from "../utils/axios";

export const createOrder = async (payload: any) => {
  const res = await api.post("/orders", payload);
  return res.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/myOrders");
  return response.data;
};


export const getOrderById = async (id:any) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const cancelOrder = async (orderId: string) => {
  await api.put(`/orders/${orderId}/cancel`);
};