import { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MyNavbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <>
      {/* Navbar */}
      <MyNavbar />

      {/* Login Card */}
      <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{ minHeight: "calc(100vh - 70px)" }}
      >
        <div className="card shadow-lg border-0" style={{ width: "380px" }}>
          <div className="card-body p-4">
            <h3 className="text-center fw-bold mb-2">Welcome Back</h3>
            <p className="text-center text-muted mb-4">
              Login to access your tasks
            </p>

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={login}
              className="btn btn-primary w-100 fw-semibold"
            >
              Login
            </button>

            <p className="text-center mt-3 mb-0">
              New user?{" "}
              <Link to="/register" className="fw-semibold">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
