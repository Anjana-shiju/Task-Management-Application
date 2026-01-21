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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ prevent page reload

    if (!formData.email.trim() || !formData.password.trim()) {
      return toast.warning("Enter email and password");
    }

    try {
      const res = await API.post("/auth/login", formData);

      if (res.data?.token && res.data?.user) {
        // ✅ Save both token & user
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success("Login successful");
        // ✅ Redirect to dashboard
        navigate("/dashboard");
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <MyNavbar />
      <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{ minHeight: "calc(100vh - 70px)" }}
      >
        <div className="card shadow-lg border-0" style={{ width: "380px" }}>
          <div className="card-body p-4">
            <h3 className="text-center fw-bold mb-3">Login</h3>
            <p className="text-center text-muted mb-4">
              Sign in to manage your tasks
            </p>

            {/* ✅ Use form so Enter works */}
            <form onSubmit={handleLogin}>
              <input
                name="email"
                type="email"
                className="form-control mb-3"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="password"
                name="password"
                className="form-control mb-3"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold"
              >
                Login
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              Don’t have an account?{" "}
              <Link to="/register" className="fw-semibold">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
