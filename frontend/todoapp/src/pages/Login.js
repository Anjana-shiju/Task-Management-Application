import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import MyNavbar from "../components/Navbar";
import API from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      return toast.warning("Enter email and password");
    }

    try {
      const res = await API.post("/auth/login", formData);

      if (res.data?.token && res.data?.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success("Login successful 🎉");
        navigate("/dashboard");
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    }
  };

  return (
    <>
      <MyNavbar />

      {/* Background */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "calc(100vh - 70px)",
          background:
            "linear-gradient(180deg, #2e8dd5 0%, #ffffff 50%, #f3f7ff 100%)",
        }}
      >
        {/* Glass Card */}
        <div
          className="card border-0"
          style={{
            width: "380px",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
          }}
        >
          <div className="card-body p-4">
            <h3 className="text-center fw-bold mb-2">Sign in</h3>
            <p className="text-center text-muted mb-4">
              Welcome back 👋
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                className="form-control mb-3"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                style={{ borderRadius: "10px" }}
              />

              <input
                type="password"
                name="password"
                className="form-control mb-3"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                style={{ borderRadius: "10px" }}
              />

              <button
                type="submit"
                className="btn w-100 fw-semibold"
                style={{
                  backgroundColor: "#111827",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                Login
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="fw-semibold text-decoration-none"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
