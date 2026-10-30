import React from "react";
import {
  FaBars,
  FaGlobe,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {

  const { user, logout } = useAuth();

  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="top-navbar">

      {/* ==========================================
          Mobile Menu Button
      ========================================== */}

      <button
        type="button"
        className="navbar-mobile-menu-btn"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <FaBars />
      </button>


      {/* ==========================================
          Dashboard Title
      ========================================== */}

      <h4 className="navbar-title mb-0">
        {t("dairyDashboard")}
      </h4>


      {/* ==========================================
          Right Section
      ========================================== */}

      <div className="navbar-right d-flex align-items-center">

        {/* Language */}

        <div className="language-selector">

          <FaGlobe />

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
            aria-label={t("language")}
          >

            <option value="hi">
              हिन्दी
            </option>

            <option value="mr">
              मराठी
            </option>

            <option value="en">
              English
            </option>

          </select>

        </div>


        {/* User */}

        <span className="navbar-user">

          👋 {user?.fullName || "Owner"}

        </span>


        {/* Logout */}

        <button
          type="button"
          className="btn btn-danger btn-sm navbar-logout"
          onClick={handleLogout}
        >

          <FaSignOutAlt className="me-1" />

          <span className="logout-text">
            {t("logout")}
          </span>

        </button>

      </div>

    </div>
  );
};

export default Navbar;