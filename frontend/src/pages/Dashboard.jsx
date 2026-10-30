import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

import {
  FaUsers,
  FaTint,
  FaMoneyBillWave,
  FaWallet,
  FaSearch,
  FaUser,
  FaArrowRight,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import DashboardCard from "../components/cards/DashboardCard";
import { getDashboard } from "../services/dashboardService";
import { getCustomers } from "../services/customerService";

import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const { t } = useLanguage();

  const [dashboard, setDashboard] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================================
  // Load Dashboard + Customers
  // ==========================================
  const loadData = async () => {
    try {
      setLoading(true);

      const [dashboardData, customerData] = await Promise.all([
        getDashboard(),
        getCustomers(),
      ]);

      setDashboard(dashboardData.dashboard);
      setCustomers(customerData.customers || []);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // Loading
  // ==========================================
  if (loading || !dashboard) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" />

        <p className="mt-3 text-muted">
          {t("loadingDashboard")}
        </p>
      </div>
    );
  }

  // ==========================================
  // User
  // ==========================================
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // ==========================================
  // Search Customers
  // ==========================================
  const searchText = search.toLowerCase().trim();

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.fullName
        ?.toLowerCase()
        .includes(searchText) ||
      customer.mobile
        ?.toLowerCase()
        .includes(searchText) ||
      customer.village
        ?.toLowerCase()
        .includes(searchText) ||
      customer.customerCode
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // ==========================================
  // Open Customer
  // ==========================================
  const openCustomer = (id) => {
    navigate(`/customers/${id}`);
  };

  return (
    <div className="container-fluid">

      {/* ==========================================
          Welcome Header
      ========================================== */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            {t("welcomeOwner")},{" "}
            {user?.fullName || t("owner")} 👋
          </h2>

          <p className="text-muted mb-0">
            {t("manageCustomersDaily")}
          </p>
        </div>

        <div className="text-end d-none d-md-block">
          <h5 className="mb-1">
            {new Date().toLocaleDateString("en-IN")}
          </h5>

          <small className="text-muted">
            {t("today")}
          </small>
        </div>

      </div>

      {/* ==========================================
          Dashboard Cards
      ========================================== */}
      <div className="row g-4">

        <div className="col-lg-3 col-md-6">
          <DashboardCard
            title={t("customers")}
            value={dashboard.totalCustomers}
            icon={<FaUsers />}
            color="#0d6efd"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <DashboardCard
            title={t("todaysMilk")}
            value={`${dashboard.todayMilk} L`}
            icon={<FaTint />}
            color="#0d6efd"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <DashboardCard
            title={t("todaysPayments")}
            value={`₹ ${dashboard.todayPayments}`}
            icon={<FaMoneyBillWave />}
            color="#198754"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <DashboardCard
            title={t("outstanding")}
            value={`₹ ${dashboard.outstanding}`}
            icon={<FaWallet />}
            color="#dc3545"
          />
        </div>

      </div>

      {/* ==========================================
          Customers Section
      ========================================== */}
      <div className="card border-0 shadow-sm mt-5">

        {/* Header */}
        <div className="card-header bg-white border-0 p-4">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

            <div>
              <h4 className="fw-bold mb-1">
                {t("myCustomers")}
              </h4>

              <p className="text-muted mb-0">
                {t("selectCustomer")}
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/customers/add")}
            >
              + {t("addCustomer")}
            </button>

          </div>

          {/* Search */}
          <div className="input-group mt-4">

            <span className="input-group-text bg-white">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control dashboard-search"
              placeholder={t("searchCustomerPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        {/* Customer List */}
        <div className="card-body pt-0">

          {filteredCustomers.length === 0 ? (

            <div className="text-center py-5">

              <FaUsers
                size={45}
                className="text-muted mb-3"
              />

              <h5 className="text-muted">
                {t("noCustomers")}
              </h5>

              {search && (
                <p className="text-muted">
                  {t("tryAnotherSearch")}
                </p>
              )}

            </div>

          ) : (

            <div className="row g-3">

              {filteredCustomers.map((customer) => {

                const balance = Number(
                  customer.currentBalance || 0
                );

                return (
                  <div
                    className="col-xl-4 col-lg-6"
                    key={customer.id}
                  >

                    <div
                      className="card h-100 border shadow-sm customer-dashboard-card"
                      style={{
                        cursor: "pointer",
                        transition: "0.2s",
                      }}
                      onClick={() =>
                        openCustomer(customer.id)
                      }
                    >

                      <div className="card-body">

                        {/* Customer Header */}
                        <div className="d-flex justify-content-between align-items-start">

                          <div className="d-flex align-items-center">

                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                background: "#e7f1ff",
                                color: "#0d6efd",
                              }}
                            >
                              <FaUser size={22} />
                            </div>

                            <div>

                              <h5 className="fw-bold mb-1">
                                {customer.fullName}
                              </h5>

                              <small className="text-muted">
                                {customer.customerCode}
                              </small>

                            </div>

                          </div>

                          <FaArrowRight
                            className="text-primary"
                          />

                        </div>

                        {/* Customer Details */}
                        <div className="mt-3">

                          <div className="d-flex justify-content-between mb-2">

                            <span className="text-muted">
                              {t("mobile")}
                            </span>

                            <strong>
                              {customer.mobile}
                            </strong>

                          </div>

                          <div className="d-flex justify-content-between mb-2">

                            <span className="text-muted">
                              {t("village")}
                            </span>

                            <strong>
                              {customer.village || "-"}
                            </strong>

                          </div>

                          <div className="d-flex justify-content-between">

                            <span className="text-muted">
                              {t("balance")}
                            </span>

                            <strong
                              className={
                                balance > 0
                                  ? "text-danger"
                                  : balance < 0
                                  ? "text-success"
                                  : "text-muted"
                              }
                            >
                              ₹ {Math.abs(balance).toFixed(2)}
                            </strong>

                          </div>

                        </div>

                        {/* Open Customer */}
                        <button
                          type="button"
                          className="btn btn-primary w-100 mt-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCustomer(customer.id);
                          }}
                        >
                          {t("openCustomer")}
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

      </div>

      {/* ==========================================
          Recent Transactions
      ========================================== */}
      <div className="card shadow-sm border-0 mt-5 mb-4">

        <div className="card-header bg-white">

          <h5 className="mb-0 fw-bold">
            {t("recentTransactions")}
          </h5>

        </div>

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-light">

              <tr>
                <th>{t("date")}</th>
                <th>{t("type")}</th>
                <th>{t("description")}</th>
                <th>{t("credit")}</th>
                <th>{t("debit")}</th>
                <th>{t("balance")}</th>
              </tr>

            </thead>

            <tbody>

              {dashboard.recentTransactions?.length > 0 ? (

                dashboard.recentTransactions.map((item) => (

                  <tr key={item.id}>

                    <td>
                      {item.transactionDate}
                    </td>

                    <td>
                      <span className="badge bg-primary">
                        {item.type}
                      </span>
                    </td>

                    <td>
                      {item.description}
                    </td>

                    <td className="text-success fw-bold">
                      ₹ {item.credit}
                    </td>

                    <td className="text-danger fw-bold">
                      ₹ {item.debit}
                    </td>

                    <td className="fw-bold">
                      ₹ {item.balance}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center text-muted py-4"
                  >
                    {t("noRecentTransactions")}
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;