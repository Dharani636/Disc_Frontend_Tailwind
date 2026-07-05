import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    try {
      setLoading(true);

      const response = await api.post("/admin/login", {
        username,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminUser", response.data.username);

        navigate("/dashboard");
      } else {
        alert("Invalid Username or Password");
      }
    } catch (error) {
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-[380px] bg-white p-10 rounded-xl2 border border-slate-200 shadow-card-hover">
        <div className="flex justify-center mb-4">
          <div className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
        </div>

        <h1 className="text-center text-[22px] font-bold tracking-tight text-slate-900 mb-1">
          Seminar Admin
        </h1>
        <p className="text-center text-slate-500 text-[13px] mb-7">
          Sign in to manage your seminar
        </p>

        <div className="flex flex-col gap-3.5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="field"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="field pr-11"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none text-base text-slate-400 hover:text-slate-600"
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <button onClick={login} disabled={loading} className="btn-primary w-full mt-1">
            {loading ? "Logging in…" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
