import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AdminContext } from "../context/adminContext";
import { DoctorContext } from "../context/doctorContext";
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  Shield, 
  Stethoscope,
  Bell,
  Settings
} from "lucide-react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const logout = () => {
    toast.success("Logged out successfully!");
    navigate("/");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
  };

  const userType = aToken ? "Admin" : "Doctor";
  const userIcon = aToken ? Shield : Stethoscope;
  const UserIcon = userIcon;

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="flex justify-between items-center px-6 py-4">
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <img
              className="h-10 w-auto cursor-pointer"
              src={assets.admin_logo}
              alt="Logo"
              onClick={() => navigate("/")}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg"
            >
              <UserIcon size={14} />
              {userType}
            </motion.div>
          </motion.div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </motion.button>

            {/* Profile Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-large border border-gray-100 py-2 z-50"
                  >
                    <button
                      onClick={() => {
                        navigate("/");
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <LogOut size={16} />
              Logout
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              <Menu size={24} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 md:hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <nav className="p-6">
                {aToken && (
                  <div className="space-y-2">
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                      to="/admin-dashboard"
                    >
                      <img src={assets.home_icon} alt="Dashboard" className="w-5 h-5" />
                      Dashboard
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                      to="/all-appointments"
                    >
                      <img src={assets.appointment_icon} alt="Appointments" className="w-5 h-5" />
                      Appointments
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                      to="/add-doctor"
                    >
                      <img src={assets.add_icon} alt="Add Doctor" className="w-5 h-5" />
                      Add Doctor
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                      to="/doctor-list"
                    >
                      <img src={assets.people_icon} alt="Doctors List" className="w-5 h-5" />
                      Doctors List
                    </NavLink>
                  </div>
                )}

                {dToken && (
                  <div className="space-y-2">
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                      to="/doctor-dashboard"
                    >
                      <img src={assets.home_icon} alt="Dashboard" className="w-5 h-5" />
                      Dashboard
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                      to="/doctor-appointments"
                    >
                      <img src={assets.appointment_icon} alt="Appointments" className="w-5 h-5" />
                      Appointments
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                      to="/add-blog"
                    >
                      <img 
                        width="20" 
                        height="20" 
                        src="https://img.icons8.com/ios/25/blog.png" 
                        alt="Add Blog" 
                        className="w-5 h-5" 
                      />
                      Add Blog
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                      to="/doctor-profile"
                    >
                      <img src={assets.people_icon} alt="Profile" className="w-5 h-5" />
                      Profile
                    </NavLink>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-medium shadow-lg"
                >
                  <LogOut size={16} />
                  Logout
                </motion.button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;