import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      return toast.warning("All fields are required");
    }

    try {
      const res = await API.post("/auth/register", formData);

      localStorage.setItem("token", res.data.token);

      toast.success("Registration successful 🎉");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #43a4ee 0%, #ffffff 50%, #f3f7ff 100%)",
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
          boxShadow: "0 20px 40px rgba(14, 148, 175, 0.12)",
        }}
      >
        <div className="card-body p-4">
          <h3 className="text-center fw-bold mb-2">
            Create account
          </h3>
          <p className="text-center text-muted mb-4">
            Get started in seconds 
          </p>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="form-control mb-3"
              value={formData.name}
              onChange={handleChange}
              style={{ borderRadius: "10px" }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="form-control mb-3"
              value={formData.email}
              onChange={handleChange}
              style={{ borderRadius: "10px" }}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-3"
              value={formData.password}
              onChange={handleChange}
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
              Register
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="fw-semibold text-decoration-none"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
