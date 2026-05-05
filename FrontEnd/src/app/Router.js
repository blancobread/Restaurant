import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import LoginPage from "../pages/auth/login/LoginPage";
import RegisterPage from "../pages/auth/register/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import HomePage from "../pages/home/HomePage";
import ProfilePage from "../pages/profile/ProfilePage";
import ReservationConfirmationPage from "../pages/reservation/confirmation/ReservationConfirmationPage";
import ReservationDetailsPage from "../pages/reservation/details/ReservationDetailsPage";
import ReservationPaymentPage from "../pages/reservation/payment/ReservationPaymentPage";
import ReservationPage from "../pages/reservation/ReservationPage";
export const router = createBrowserRouter([
  {
    element: _jsx(MainLayout, {}),
    children: [
      { path: "/", element: _jsx(HomePage, {}) },
      { path: "/reservation", element: _jsx(ReservationPage, {}) },
      { path: "/reservation/details", element: _jsx(ReservationDetailsPage, {}) },
      {
        path: "/reservation/payment/:id",
        element: _jsx(ReservationPaymentPage, {}),
      },
      {
        path: "/reservation/confirmation/:id",
        element: _jsx(ReservationConfirmationPage, {}),
      },
    ],
  },
  {
    element: _jsx(AuthLayout, {}),
    children: [
      { path: "/login", element: _jsx(LoginPage, {}) },
      { path: "/register", element: _jsx(RegisterPage, {}) },
    ],
  },
  {
    element: _jsx(DashboardLayout, {}),
    children: [
      { path: "/dashboard", element: _jsx(DashboardPage, {}) },
      { path: "/profile", element: _jsx(ProfilePage, {}) },
    ],
  },
  {
    element: _jsx(AdminLayout, {}),
    children: [{ path: "/admin", element: _jsx(AdminDashboardPage, {}) }],
  },
]);
