import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  role: string | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  userId: localStorage.getItem("userId"),

  login: (token) => {
    const decoded: any = jwtDecode(token);

    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", decoded.sub);

    set({ token, role, userId: decoded.sub });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    set({ token: null, role: null, userId: null });
  },
}));
