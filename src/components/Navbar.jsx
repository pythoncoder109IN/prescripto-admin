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
  ChevronDown
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
    // Clear tokens first
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
    
    // Close any open menus
    setIsMenuOpen(false);
    setShowProfileMenu(false);
    
    // Navigate to login page immediately
    navigate("/", { replace: true });
    
    // Show success message after navigation
    setTimeout(() => {
      toast.success("Logged out successfully!", {
        icon: "👋",
        style: {
          borderRadius: "12px",
          background: "#10b981",
          color: "#fff",
        },
      });
    }, 100);
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
        className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm"
      >
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
          <motion.div 
            className="flex items-center gap-2 sm:gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.img
              className="h-8 sm:h-12 w-auto cursor-pointer"
              src={assets.admin_logo}
              alt="Logo"
              onClick={() => navigate("/")}
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg"
            >
              <UserIcon size={14} />
              {userType}
            </motion.div>
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Profile Menu - Hidden on small screens */}
            <div className="relative hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 sm:gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User size={16} className="text-white" />
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{userType} Panel</p>
                      <p className="text-xs text-gray-500">Manage your account</p>
                    </div>
                    
                    <motion.button
                      whileHover={{ backgroundColor: "#f3f4f6", x: 4 }}
                      onClick={() => {
                        navigate("/");
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-200"
                    >
                      <User size={16} />
                      <span className="font-medium">Profile</span>
                    </motion.button>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <motion.button
                        whileHover={{ backgroundColor: "#fef2f2", x: 4 }}
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 transition-all duration-200"
                      >
                        <LogOut size={16} />
                        <span className="font-medium">Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Logout Button - Hidden on mobile */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <LogOut size={16} />
              <span className="hidden xl:inline">Logout</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(true)}
              className="sm:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-full hover:bg-blue-50"
            >
              <Menu size={20} />
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 sm:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 sm:hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                  <p className="text-sm text-gray-600">{userType} Panel</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-full hover:bg-white"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <nav className="p-6">
                {aToken && (
                  <div className="space-y-3">
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-700 hover:bg-gray-50 hover:transform hover:scale-105"
                        }`
                      }
                      to="/admin-dashboard"
                    >
                      <img src={assets.home_icon} alt="Dashboard" className="w-6 h-6" />
                      <span className="font-semibold">Dashboard</span>
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-700 hover:bg-gray-50 hover:transform hover:scale-105"
                        }`
                      }
                      to="/all-appointments"
                    >
                      <img src={assets.appointment_icon} alt="Appointments" className="w-6 h-6" />
                      <span className="font-semibold">Appointments</span>
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-700 hover:bg-gray-50 hover:transform hover:scale-105"
                        }`
                      }
                      to="/add-doctor"
                    >
                      <img src={assets.add_icon} alt="Add Doctor" className="w-6 h-6" />
                      <span className="font-semibold">Add Doctor</span>
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-700 hover:bg-gray-50 hover:transform hover:scale-105"
                        }`
                      }
                      to="/doctor-list"
                    >
                      <img src={assets.people_icon} alt="Doctors List" className="w-6 h-6" />
                      <span className="font-semibold">Doctors List</span>
                    </NavLink>
                  </div>
                )}

                {dToken && (
                  <div className="space-y-3">
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-700 hover:bg-gray-50 hover:transform hover:scale-105"
                        }`
                      }
                      to="/doctor-dashboard"
                    >
                      <img src={assets.home_icon} alt="Dashboard" className="w-6 h-6" />
                      <span className="font-semibold">Dashboard</span>
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-700 hover:bg-gray-50 hover:transform hover:scale-105"
                        }`
                      }
                      to="/doctor-appointments"
                    >
                      <img src={assets.appointment_icon} alt="Appointments" className="w-6 h-6" />
                      <span className="font-semibold">Appointments</span>
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-700 hover:bg-gray-50 hover:transform hover:scale-105"
                        }`
                      }
                      to="/add-blog"
                    >
                      <img 
                        width="24" 
                        height="24" 
                        src="https://img.icons8.com/ios/25/blog.png" 
                        alt="Add Blog" 
                        className="w-6 h-6" 
                      />
                      <span className="font-semibold">Add Blog</span>
                    </NavLink>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-700 hover:bg-gray-50 hover:transform hover:scale-105"
                        }`
                      }
                      to="/doctor-profile"
                    >
                      <img src={assets.people_icon} alt="Profile" className="w-6 h-6" />
                      <span className="font-semibold">Profile</span>
                    </NavLink>
                  </div>
                )}

                {/* Profile Section for Mobile */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <motion.button
                    onClick={() => {
                      navigate("/");
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 mb-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User size={18} />
                    <span className="font-medium">Profile</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-semibold shadow-lg"
                  >
                    <LogOut size={18} />
                    Logout
                  </motion.button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;