import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import MyNavbar from "../components/Navbar"

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

  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      toast.success("Registration successful");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <>
      {/* ✅ Navbar same as login */}
      <MyNavbar />

      {/* ✅ Register card */}
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

            <input
              name="name"
              className="form-control mb-3"
              placeholder="Full Name"
              onChange={handleChange}
            />

            <input
              name="email"
              type="email"
              className="form-control mb-3"
              placeholder="Email Address"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              className="form-control mb-3"
              placeholder="Password"
              onChange={handleChange}
            />

            <button
              onClick={handleRegister}
              className="btn btn-primary w-100 fw-semibold"
            >
              Register
            </button>

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
