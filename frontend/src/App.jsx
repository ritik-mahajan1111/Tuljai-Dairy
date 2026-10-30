import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import AddCustomer from "./pages/AddCustomer";
import EditCustomer from "./pages/EditCustomer";

import Milk from "./pages/Milk";
import Payments from "./pages/Payments";
import Statement from "./pages/Statement";
import Profile from "./pages/Profile";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Routes>

      {/* Login */}
      <Route path="/" element={<Login />} />

      <Route
    path="/register"
    element={<Register />}
  />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Customers */}
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Customers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Customer Details */}
      <Route
        path="/customers/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CustomerDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Add Customer */}
      <Route
        path="/customers/add"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AddCustomer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Edit Customer */}
      <Route
        path="/customers/edit/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EditCustomer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Milk */}
      <Route
        path="/milk"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Milk />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Payments */}
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Payments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Statement */}
      <Route
        path="/statement"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Statement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;