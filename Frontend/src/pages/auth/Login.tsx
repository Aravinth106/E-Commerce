import { useNavigate } from "react-router-dom";
import image from "../../assets/react.svg";
import { useAuthStore } from "../../store/auth.store";
import { useState } from "react";
import { login as loginApi } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginApi({ email, password });

      // res.token expected
      loginStore(res.token);

      const role = localStorage.getItem("role");

      if (role === "Admin") {
        navigate("/admin/categories", { replace: true });
      } else {
        navigate("/orders", { replace: true });
      }

    } catch (err) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left Image Section */}
        <div className="hidden md:block">
          <img
            src={image}
            alt="Login Background"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form Section */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-md">

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Login
            </h1>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button className="w-full bg-indigo-700 text-white py-3 rounded-md font-semibold hover:bg-indigo-800 transition duration-300" onClick={handleSubmit}>
              {loading ? "Logging in..." : "Login"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
