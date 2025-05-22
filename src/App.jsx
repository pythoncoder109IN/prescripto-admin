import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
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

  return aToken || dToken ? (
    <div className="bg-[#F8F9Fd]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<AdminProfile />}></Route>
          <Route path="/admin-dashboard" element={<Dashboard />}></Route>
          <Route path="/all-appointments" element={<AllAppointments />}></Route>
          <Route path="/add-doctor" element={<AddDoctor />}></Route>
          <Route path="/doctor-list" element={<DoctorsList />}></Route>
          <Route path="/doctor-dashboard" element={<DoctorDashboard />}></Route>
          <Route path="/doctor-appointments" element={<DoctorAppointment />}></Route>
          <Route path="/appointments/:appointmentId" element={<AppointmentPage />}></Route>
          <Route path="/doctor-profile" element={<DoctorProfile />}></Route>
          <Route path="/meeting" element={<MeetingRoom />}></Route>
          <Route path="/add-blog" element={<BlogEditor />}></Route>
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
