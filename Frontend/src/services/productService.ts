import api from "../utils/axios";

export const createProduct = async (data: any) => {
  const res = await api.post("/products", data);
  return res.data;
};

export const getProductsPaged = async (page = 1, pageSize = 10) => {
  const res = await api.get("/products", {
    params: { page, pageSize },
  });
  return res.data;
};

export const updateProduct = async (id: string, data: any) => {
  await api.put(`/products/${id}`, data);
};

export const deleteProduct = async (id: string) => {
  await api.delete(`/products/${id}`);
};
