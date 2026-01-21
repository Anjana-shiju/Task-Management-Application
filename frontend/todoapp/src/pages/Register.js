import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import MyNavbar from "../components/Navbar";
import API from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      return toast.warning("Fill all fields");
    }

    try {
      const res = await API.post("/auth/register", formData);

      if (res.data?.token && res.data?.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      toast.success("Registration successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
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
            <h3 className="text-center fw-bold mb-3">Create Account</h3>
            <p className="text-center text-muted mb-4">
              Sign up to manage your tasks
            </p>

            <form onSubmit={handleRegister}>
              <input
                name="name"
                className="form-control mb-3"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />

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
                Register
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              Already have an account?{" "}
              <Link to="/login" className="fw-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
