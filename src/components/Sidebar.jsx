import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { AdminContext } from "../context/adminContext";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/doctorContext";
import { 
  Home, 
  Calendar, 
  UserPlus, 
  Users, 
  FileText, 
  User,
  Activity,
  Sparkles
} from "lucide-react";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  const adminMenuItems = [
    { to: "/admin-dashboard", icon: Home, label: "Dashboard", asset: assets.home_icon, color: "from-blue-500 to-blue-600" },
    { to: "/all-appointments", icon: Calendar, label: "Appointments", asset: assets.appointment_icon, color: "from-green-500 to-green-600" },
    { to: "/add-doctor", icon: UserPlus, label: "Add Doctor", asset: assets.add_icon, color: "from-purple-500 to-purple-600" },
    { to: "/doctor-list", icon: Users, label: "Doctors List", asset: assets.people_icon, color: "from-orange-500 to-orange-600" },
  ];

  const doctorMenuItems = [
    { to: "/doctor-dashboard", icon: Activity, label: "Dashboard", asset: assets.home_icon, color: "from-blue-500 to-blue-600" },
    { to: "/doctor-appointments", icon: Calendar, label: "Appointments", asset: assets.appointment_icon, color: "from-green-500 to-green-600" },
    { to: "/add-blog", icon: FileText, label: "Add Blog", asset: "https://img.icons8.com/ios/25/blog.png", color: "from-purple-500 to-purple-600" },
    { to: "/doctor-profile", icon: User, label: "Profile", asset: assets.people_icon, color: "from-orange-500 to-orange-600" },
  ];

  const menuItems = aToken ? adminMenuItems : doctorMenuItems;

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="hidden lg:flex flex-col w-64 xl:w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 min-h-screen sticky top-16 shadow-sm"
    >
      <div className="p-4 xl:p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 xl:mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-lg xl:text-xl font-bold text-gray-900">
                {aToken ? "Admin Panel" : "Doctor Panel"}
              </h2>
              <p className="text-xs xl:text-sm text-gray-600">Welcome back!</p>
            </div>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </motion.div>

        <nav className="space-y-2 xl:space-y-3">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.to}
              variants={itemVariants}
              custom={index}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 xl:gap-4 px-3 xl:px-4 py-3 xl:py-4 rounded-xl xl:rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:transform hover:scale-105"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeBackground"
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl xl:rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    <div className={`relative p-1.5 xl:p-2 rounded-lg xl:rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-white/20 shadow-lg" 
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}>
                      <img 
                        src={item.asset} 
                        alt={item.label}
                        className={`w-5 h-5 xl:w-6 xl:h-6 transition-all duration-300 ${
                          isActive 
                            ? "filter brightness-0 invert" 
                            : "group-hover:filter group-hover:brightness-0 group-hover:invert group-hover:hue-rotate-180"
                        }`}
                      />
                    </div>
                    
                    <div className="relative">
                      <span className="font-semibold text-sm xl:text-base">{item.label}</span>
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/50 rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                        />
                      )}
                    </div>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Bottom decoration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-auto p-4 xl:p-6"
      >
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl xl:rounded-2xl p-4 xl:p-5 border border-blue-200/50 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs xl:text-sm font-bold text-gray-900">
                {aToken ? "Admin" : "Doctor"}
              </p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-gray-600">Online</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>System Status</span>
              <span className="font-semibold text-green-600">Excellent</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;