import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaLock,
  FaMobileAlt,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
   
  
    if (loading) return;

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        mobile: form.mobile.trim(),
        password: form.password,
      });

      const data = response.data;

      console.log("Login API Response:", data);

      if (!data?.token || !data?.user) {
        throw new Error(
          "Login API response does not contain token or user"
        );
      }

      login(data.token, data.user);

      toast.success("Login Successful");

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error("Login Error:", error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Login Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-decoration decoration-one" />
      <div className="login-decoration decoration-two" />

      <div className="login-container">

        <div className="login-info">

          <div className="brand-mark">TD</div>

          <h1>Tuljai Dairy</h1>

          <h4>Dairy Management System</h4>

          <p>
            Manage your customers, milk entries,
            payments and daily dairy records
            from one simple dashboard.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <span>✓</span>
              Customer Management
            </div>

            <div className="login-feature">
              <span>✓</span>
              Milk & Payment Tracking
            </div>

            <div className="login-feature">
              <span>✓</span>
              Complete Customer Statements
            </div>

          </div>

        </div>

        <div className="login-card">

          <div className="login-card-header">

            <div className="login-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h2>Welcome Back</h2>
              <p>Login to your dairy account</p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="login-input">

              <label>Mobile Number</label>

              <div className="login-input-wrapper">

                <FaMobileAlt />

                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  required
                  autoComplete="username"
                />

              </div>

            </div>

            <div className="login-input">

              <label>Password</label>

              <div className="login-input-wrapper">

                <FaLock />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />

              </div>

            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Login to Dashboard
                  <FaArrowRight />
                </>
              )}

            </button>

          </form>

          <div className="text-center mt-4">

            <p className="mb-2 text-muted">
              New to Tuljai Dairy?
            </p>

            <Link
              to="/register"
              className="fw-bold text-primary text-decoration-none"
            >
              Create New Dairy Account →
            </Link>

          </div>

          <div className="login-footer">

            <span>Secure Dairy Management</span>
            <span>•</span>
            <span>Tuljai Dairy</span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;