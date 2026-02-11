import type { UpdateCategoryRequest } from "../types/Category.types";
import type {  Product } from "../types/order.types";
import type { Category } from "../types/Category.types";
import api from "../utils/axios";

export const getParentCategories = async () => {
  const res = await api.get("/categories/parents");
  return res.data;
};

export const getChildCategories = async (parentId: string) => {
  const res = await api.get(`/categories/${parentId}/children`);
  return res.data;
};

// export const getProductsByCategory = async (childCategoryId: string) => {
//   const res = await api.get(`/categories/${childCategoryId}/products`);
//   return res.data;
// };

// export const getAllCategories = async () => {
//   const res = await api.get("/categories");
//   return res.data;
// };

export const createCategory = async (data: {
  name: string;
  parentId?: string | null;
}) => {
  const res = await api.post("/categories", data);
  return res.data;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await api.get<Category[]>("/categories");
  return res.data;
};

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get<Product[]>("/products");
  return res.data;
};

export const getProductsByCategory = async (
  childCategoryId: string
): Promise<Product[]> => {
  const res = await api.get<Product[]>(
    `/categories/${childCategoryId}/products`
  );
  return res.data;
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryRequest
): Promise<Category> => {
  const res = await api.put(`/admin/categories/${id}`, payload);
  return res.data;
};

// Delete category
export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/admin/categories/${id}`);
};