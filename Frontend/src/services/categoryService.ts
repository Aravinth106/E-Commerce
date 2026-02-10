import api from "../utils/axios";

export const getParentCategories = async () => {
  const res = await api.get("/categories/parents");
  return res.data;
};

export const getChildCategories = async (parentId: string) => {
  const res = await api.get(`/categories/${parentId}/children`);
  return res.data;
};

export const getProductsByCategory = async (childCategoryId: string) => {
  const res = await api.get(`/categories/${childCategoryId}/products`);
  return res.data;
};
