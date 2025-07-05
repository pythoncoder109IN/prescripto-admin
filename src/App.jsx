import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import { AdminContext } from "./context/adminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import { DoctorContext } from "./context/doctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import AdminProfile from "./pages/Admin/AdminProfile";
import MeetingRoom from "./pages/Doctor/Meeting";
import AppointmentPage from "./pages/Doctor/AppointmentPage";
import BlogEditor from "./pages/Doctor/AddBlogPage";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  // Check if user is authenticated
  const isAuthenticated = aToken || dToken;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <Navbar />
            <div className="flex">
              <Sidebar />
              <motion.main 
                className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Routes>
                  <Route path="/" element={<AdminProfile />} />
                  <Route path="/admin-dashboard" element={<Dashboard />} />
                  <Route path="/all-appointments" element={<AllAppointments />} />
                  <Route path="/add-doctor" element={<AddDoctor />} />
                  <Route path="/doctor-list" element={<DoctorsList />} />
                  <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                  <Route path="/doctor-appointments" element={<DoctorAppointment />} />
                  <Route path="/appointments/:appointmentId" element={<AppointmentPage />} />
                  <Route path="/doctor-profile" element={<DoctorProfile />} />
                  <Route path="/meeting" element={<MeetingRoom />} />
                  <Route path="/add-blog" element={<BlogEditor />} />
                </Routes>
              </motion.main>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Login />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;