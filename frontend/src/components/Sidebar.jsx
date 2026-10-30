import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaPlusCircle,
  FaTint,
  FaMoneyBillWave,
  FaBook,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";

import { useLanguage } from "../i18n/LanguageContext";

import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {

  const { t } = useLanguage();

  return (
    <>
      {/* ==========================================
          Mobile Overlay
      ========================================== */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}


      {/* ==========================================
          Sidebar
      ========================================== */}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >

        {/* ==========================================
            Header / Logo
        ========================================== */}

        <div className="sidebar-header">

          <div className="sidebar-logo-icon">
            🥛
          </div>

          <div>

            <div className="sidebar-logo">
              Tuljai Dairy
            </div>

            <small>
              {t("managementSystem")}
            </small>

          </div>


          {/* Mobile Close */}

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>

        </div>


        {/* ==========================================
            Navigation
        ========================================== */}

        <nav className="sidebar-nav">

          <NavLink
            to="/dashboard"
            onClick={onClose}
          >
            <FaHome />
            <span>{t("dashboard")}</span>
          </NavLink>


          <NavLink
            to="/customers"
            onClick={onClose}
          >
            <FaUsers />
            <span>{t("customers")}</span>
          </NavLink>


          <NavLink
            to="/customers/add"
            onClick={onClose}
          >
            <FaPlusCircle />
            <span>{t("addCustomer")}</span>
          </NavLink>


          <NavLink
            to="/milk"
            onClick={onClose}
          >
            <FaTint />
            <span>{t("milkEntry")}</span>
          </NavLink>


          <NavLink
            to="/payments"
            onClick={onClose}
          >
            <FaMoneyBillWave />
            <span>{t("payments")}</span>
          </NavLink>


          <NavLink
            to="/statement"
            onClick={onClose}
          >
            <FaBook />
            <span>{t("statement")}</span>
          </NavLink>


          <NavLink
            to="/profile"
            onClick={onClose}
          >
            <FaUserCircle />
            <span>{t("profile")}</span>
          </NavLink>

        </nav>


        {/* ==========================================
            Bottom
        ========================================== */}

        <div className="sidebar-bottom">

          <div className="sidebar-version">
            Tuljai Dairy
          </div>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;