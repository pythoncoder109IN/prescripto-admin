import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminContext } from "../../context/adminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/appContext";
import { 
  Users, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Sparkles
} from "lucide-react";

const Dashboard = () => {
  const { dashData, getDashData, aToken, cancelAppointment } = useContext(AdminContext);
  const { slotDateFormat, Loader } = useContext(AppContext);
  
  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  const statsCards = [
    {
      title: "Total Doctors",
      value: dashData?.doctors || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500"
    },
    {
      title: "Appointments",
      value: dashData?.appointments || 0,
      icon: Calendar,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      iconBg: "bg-green-500"
    },
    {
      title: "Total Patients",
      value: dashData?.patients || 0,
      icon: UserCheck,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!dashData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div 
      className="p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="text-blue-500" size={32} />
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            className={`bg-gradient-to-br ${card.bgColor} rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300`}
            whileHover={{ scale: 1.05, y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
                <motion.p 
                  className="text-3xl font-bold text-gray-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {card.value}
                </motion.p>
              </div>
              <motion.div 
                className={`p-4 ${card.iconBg} rounded-2xl shadow-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <card.icon className="text-white" size={24} />
              </motion.div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="text-green-500" size={16} />
              <span className="text-green-600 text-sm font-medium">+12% from last month</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Latest Bookings */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        variants={itemVariants}
      >
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Latest Bookings</h2>
              <p className="text-gray-600">Recent appointment activities</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {dashData.latestAppointments?.map((item, index) => (
            <motion.div
              key={index}
              className="p-6 hover:bg-gray-50 transition-colors duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.img
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    src={item.docData.image}
                    alt={item.docData.name}
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{item.docData.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={14} />
                      {slotDateFormat(item.slotDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {item.cancelled ? (
                    <motion.div 
                      className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <XCircle size={14} />
                      Cancelled
                    </motion.div>
                  ) : item.isCompleted ? (
                    <motion.div 
                      className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle size={14} />
                      Completed
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={() => cancelAppointment(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img src={assets.cancel_icon} className="w-6 h-6" alt="Cancel" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;