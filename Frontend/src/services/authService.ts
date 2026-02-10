import type { LoginRequest } from "../types/auth.types";
import api from "../utils/axios";

export const login = async (data: LoginRequest) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
