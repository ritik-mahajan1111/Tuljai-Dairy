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
setForm({
...form,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();

```
try {
  setLoading(true);

  const { data } = await api.post("/auth/login", form);

  login(data.token, data.user);

  toast.success("Login Successful");

  navigate("/dashboard", {
    replace: true,
  });

} catch (error) {
  console.error("Login Error:", error);

  toast.error(
    error.response?.data?.message || "Login Failed"
  );

} finally {
  setLoading(false);
}
```

};

return ( <div className="login-page">

```
  <div className="login-decoration decoration-one" />
  <div className="login-decoration decoration-two" />

  <div className="login-container">

    {/* LEFT INFORMATION SECTION */}
    <div className="login-info">

      <div className="brand-mark">
        TD
      </div>

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

    {/* LOGIN CARD */}
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

        {/* MOBILE */}
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
              maxLength="10"
              required
              autoComplete="username"
            />

          </div>

        </div>

        {/* PASSWORD */}
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

        {/* LOGIN BUTTON */}
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

      {/* REGISTER LINK */}
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

      {/* FOOTER */}
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
