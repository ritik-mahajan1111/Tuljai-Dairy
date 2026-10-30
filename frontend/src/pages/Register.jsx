import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaStore,
} from "react-icons/fa";
import toast from "react-hot-toast";

import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    dairyName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        fullName: form.fullName,
        dairyName: form.dairyName,
        mobile: form.mobile,
        email: form.email,
        password: form.password,
        address: form.address,
      });

      toast.success(
        "Dairy Owner registered successfully!"
      );

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background:
          "linear-gradient(135deg, #eef6ff 0%, #ffffff 50%, #e8f1ff 100%)",
      }}
    >
      <div
        className="card border-0 shadow-lg w-100"
        style={{
          maxWidth: "520px",
          borderRadius: "20px",
        }}
      >
        <div className="card-body p-4 p-md-5">

          {/* LOGO */}
          <div className="text-center mb-4">

            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "70px",
                height: "70px",
                background: "#e8f1ff",
                color: "#0d6efd",
                fontSize: "30px",
              }}
            >
              🥛
            </div>

            <h2 className="fw-bold mb-1">
              Create Dairy Account
            </h2>

            <p className="text-muted mb-0">
              Register as a Dairy Owner
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}
            <div className="input-group mb-3">

              <span className="input-group-text bg-white">
                <FaUser />
              </span>

              <input
                type="text"
                name="fullName"
                className="form-control"
                placeholder="Owner Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
              />

            </div>

            {/* DAIRY NAME */}
            <div className="input-group mb-3">

              <span className="input-group-text bg-white">
                <FaStore />
              </span>

              <input
                type="text"
                name="dairyName"
                className="form-control"
                placeholder="Dairy Name"
                value={form.dairyName}
                onChange={handleChange}
                required
              />

            </div>

            {/* MOBILE */}
            <div className="input-group mb-3">

              <span className="input-group-text bg-white">
                <FaPhone />
              </span>

              <input
                type="tel"
                name="mobile"
                className="form-control"
                placeholder="10 Digit Mobile Number"
                value={form.mobile}
                onChange={handleChange}
                maxLength="10"
                required
              />

            </div>

            {/* EMAIL */}
            <div className="input-group mb-3">

              <span className="input-group-text bg-white">
                <FaEnvelope />
              </span>

              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email Address (Optional)"
                value={form.email}
                onChange={handleChange}
              />

            </div>

            {/* PASSWORD */}
            <div className="input-group mb-3">

              <span className="input-group-text bg-white">
                <FaLock />
              </span>

              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group mb-3">

              <span className="input-group-text bg-white">
                <FaLock />
              </span>

              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />

            </div>

            {/* ADDRESS */}
            <div className="input-group mb-4">

              <span className="input-group-text bg-white">
                <FaMapMarkerAlt />
              </span>

              <textarea
                name="address"
                className="form-control"
                placeholder="Dairy Address"
                rows="2"
                value={form.address}
                onChange={handleChange}
              />

            </div>

            {/* REGISTER */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Dairy Account"}
            </button>

          </form>

          {/* LOGIN */}
          <div className="text-center mt-4">

            <span className="text-muted">
              Already have an account?{" "}
            </span>

            <Link
              to="/"
              className="text-primary fw-semibold text-decoration-none"
            >
              Login
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;