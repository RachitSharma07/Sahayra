import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import Layout from "./components/Layout";
import CustomerLayout from "./components/CustomerLayout";
import ProviderLayout from "./components/ProviderLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Customer from "./pages/Customer";
import Provider from "./pages/Provider";
import Admin from "./pages/Admin";

import ProviderDashboard from "./pages/ProviderDashboard";
import CreateService from "./pages/CreateService";
import ServiceManagement from "./pages/ServiceManagement";
import ProviderBookingHistory from "./pages/ProviderBookingHistory";

import BookingHistory from "./pages/BookingHistory";
import CreateReview from "./pages/CreateReview";

import ServiceList from "./pages/ServiceList";
import ServiceDetails from "./pages/ServiceDetails";

import Chat from "./components/Chat";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* =========================================
                PUBLIC / COMMON ROUTES
            ========================================= */}

            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />

              <Route path="login" element={<Login />} />

              <Route path="register" element={<Register />} />

              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* =========================================
                CUSTOMER LAYOUT
                Sidebar + Header stay mounted
            ========================================= */}

            <Route element={<CustomerLayout />}>
              <Route
                path="/customer"
                element={
                  <RoleRoute allowedRole="customer">
                    <Customer />
                  </RoleRoute>
                }
              />

              <Route
                path="/services"
                element={
                  <ProtectedRoute>
                    <ServiceList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/services/:serviceId"
                element={
                  <ProtectedRoute>
                    <ServiceDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customer/bookings"
                element={
                  <ProtectedRoute>
                    <BookingHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customer/review"
                element={
                  <ProtectedRoute>
                    <CreateReview />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* =========================================
                PROVIDER LAYOUT
                Sidebar stays mounted
            ========================================= */}

            <Route element={<ProviderLayout />}>
              <Route
                path="/provider"
                element={
                  <RoleRoute allowedRole="provider">
                    <Provider />
                  </RoleRoute>
                }
              />

              <Route
                path="/provider/dashboard"
                element={
                  <ProtectedRoute>
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/provider/create-service"
                element={
                  <ProtectedRoute>
                    <CreateService />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/provider/services"
                element={
                  <ProtectedRoute>
                    <ServiceManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/provider/bookings"
                element={
                  <ProtectedRoute>
                    <ProviderBookingHistory />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* =========================================
                ADMIN
            ========================================= */}

            <Route
              path="/admin"
              element={
                <RoleRoute allowedRole="admin">
                  <Admin />
                </RoleRoute>
              }
            />

            {/* =========================================
                CHAT
            ========================================= */}

            <Route
              path="/chat/:userId"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
