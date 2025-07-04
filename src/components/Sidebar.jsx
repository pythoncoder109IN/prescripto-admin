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
  Activity
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
    { to: "/admin-dashboard", icon: Home, label: "Dashboard", asset: assets.home_icon },
    { to: "/all-appointments", icon: Calendar, label: "Appointments", asset: assets.appointment_icon },
    { to: "/add-doctor", icon: UserPlus, label: "Add Doctor", asset: assets.add_icon },
    { to: "/doctor-list", icon: Users, label: "Doctors List", asset: assets.people_icon },
  ];

  const doctorMenuItems = [
    { to: "/doctor-dashboard", icon: Activity, label: "Dashboard", asset: assets.home_icon },
    { to: "/doctor-appointments", icon: Calendar, label: "Appointments", asset: assets.appointment_icon },
    { to: "/add-blog", icon: FileText, label: "Add Blog", asset: "https://img.icons8.com/ios/25/blog.png" },
    { to: "/doctor-profile", icon: User, label: "Profile", asset: assets.people_icon },
  ];

  const menuItems = aToken ? adminMenuItems : doctorMenuItems;

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 min-h-screen sticky top-16"
    >
      <div className="p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {aToken ? "Admin Panel" : "Doctor Panel"}
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
        </motion.div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.to}
              variants={itemVariants}
              custom={index}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary-600 hover:transform hover:scale-105"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? "bg-white/20" 
                        : "bg-gray-100 group-hover:bg-primary-100"
                    }`}>
                      <img 
                        src={item.asset} 
                        alt={item.label}
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive 
                            ? "filter brightness-0 invert" 
                            : "group-hover:filter group-hover:brightness-0 group-hover:invert group-hover:hue-rotate-180"
                        }`}
                      />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
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
        className="mt-auto p-6"
      >
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {aToken ? "Admin" : "Doctor"}
              </p>
              <p className="text-xs text-gray-600">Online</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ delay: 1, duration: 1 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;