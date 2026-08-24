import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CreateOrder from "../pages/customer/CreateOrder";
import CustomerOrders from "../pages/customer/CustomerOrders";
import CustomerOrderTracking from "../pages/customer/CustomerOrderTracking";
import DriverDashboard from "../pages/driver/DriverDashboard";
import DriverActiveDelivery from "../pages/driver/DriverActiveDelivery";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminDrivers from "../pages/admin/AdminDrivers";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";

const ROLE_HOME = { CUSTOMER: "/customer", DRIVER: "/driver", ADMIN: "/admin" };

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to={ROLE_HOME[user.role]} replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to={ROLE_HOME[user.role]} replace /> : <Register />}
      />

      <Route
        path="/customer/orders/new"
        element={
          <ProtectedRoute roles={["CUSTOMER"]}>
            <CreateOrder />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/profile" element={<Profile />} />

        <Route
          path="/customer"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders/:id"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerOrderTracking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver"
          element={
            <ProtectedRoute roles={["DRIVER"]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/orders/:id"
          element={
            <ProtectedRoute roles={["DRIVER"]}>
              <DriverActiveDelivery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <CustomerOrderTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drivers"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDrivers />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to={user ? ROLE_HOME[user.role] : "/login"} replace />} />
      <Route path="*" element={<Navigate to={user ? ROLE_HOME[user.role] : "/login"} replace />} />
    </Routes>
  );
}

export default AppRoutes;
