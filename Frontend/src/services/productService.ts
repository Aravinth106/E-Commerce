import type { PagedResult, Product, ProductAdmin } from "../types/Product.types";
import api from "../utils/axios";

// export const createProduct = async (data: any) => {
//   const res = await api.post("/products", data);
//   return res.data;
// };

// export const getProductsPaged = async (page = 1, pageSize = 10) => {
//   const res = await api.get("/products", {
//     params: { page, pageSize },
//   });
//   return res.data;
// };

// export const updateProduct = async (id: string, data: any) => {
//   await api.put(`/products/${id}`, data);
// };

// export const deleteProduct = async (id: string) => {
//   await api.delete(`/products/${id}`);
// };



export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get("/admin/products");
  return res.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data: Partial<Product>) => {
  const res = await api.post("/products", data);
  return res.data;
};

export const updateProduct = async (
  id: string,
  data: Partial<Product>
) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  await api.delete(`/products/${id}`);
};

export interface AdminProductQuery {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

export const getAdminProducts = async (
  query: AdminProductQuery
): Promise<PagedResult<ProductAdmin>> => {
  const res = await api.get("/products/admin", {
    params: query,
  });

  return res.data;
};