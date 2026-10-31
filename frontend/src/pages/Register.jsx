import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaStore,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

import toast from "react-hot-toast";

import api from "../services/api";

import "../styles/register.css";

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

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      toast.error("Enter valid 10 digit mobile number");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", {
        fullName: form.fullName.trim(),
        dairyName: form.dairyName.trim(),
        mobile: form.mobile,
        email: form.email.trim() || null,
        password: form.password,
        address: form.address.trim(),
      });

      if (data.success) {
        toast.success("Dairy Account Created Successfully!");

        setForm({
          fullName: "",
          dairyName: "",
          mobile: "",
          email: "",
          password: "",
          confirmPassword: "",
          address: "",
        });

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1200);
      }
    } catch (error) {
      console.error("Registration Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Registration Failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-decoration register-decoration-one" />
      <div className="register-decoration register-decoration-two" />

      <div className="register-container">

        {/* LEFT INFORMATION SECTION */}

        <div className="register-info">

          <div className="register-brand-mark">
            TD
          </div>

          <h1>Tuljai Dairy</h1>

          <h4>Dairy Management System</h4>

          <p>
            Start managing your dairy business with
            a simple, secure and professional
            dairy management system.
          </p>

          <div className="register-features">

            <div className="register-feature">
              <span>✓</span>
              Customer Management
            </div>

            <div className="register-feature">
              <span>✓</span>
              Milk & Payment Tracking
            </div>

            <div className="register-feature">
              <span>✓</span>
              Complete Customer Statements
            </div>

          </div>

        </div>

        {/* RIGHT REGISTRATION FORM */}

        <div className="register-card">

          <div className="register-card-header">

            <div className="register-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h2>Create Dairy Account</h2>
              <p>Register as a Dairy Owner</p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="register-input">

              <label>Owner Full Name</label>

              <div className="register-input-wrapper">
                <FaUser />

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter owner full name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="register-input">

              <label>Dairy Name</label>

              <div className="register-input-wrapper">
                <FaStore />

                <input
                  type="text"
                  name="dairyName"
                  placeholder="Enter dairy name"
                  value={form.dairyName}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="register-input">

              <label>Mobile Number</label>

              <div className="register-input-wrapper">
                <FaPhone />

                <input
                  type="tel"
                  name="mobile"
                  placeholder="10 digit mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>

            </div>

            <div className="register-input">

              <label>Email Address (Optional)</label>

              <div className="register-input-wrapper">
                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="register-input">

              <label>Password</label>

              <div className="register-input-wrapper">
                <FaLock />

                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="register-input">

              <label>Confirm Password</label>

              <div className="register-input-wrapper">
                <FaLock />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="register-input">

              <label>Dairy Address</label>

              <div className="register-input-wrapper register-textarea-wrapper">
                <FaMapMarkerAlt />

                <textarea
                  name="address"
                  placeholder="Enter dairy address"
                  rows="2"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Dairy Account
                  <FaArrowRight />
                </>
              )}
            </button>

          </form>

          <div className="register-login-link">
            Already have an account?

            <Link to="/">
              Login
            </Link>
          </div>

          <div className="register-footer">
            Secure Dairy Management
            <span>•</span>
            Tuljai Dairy
          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;