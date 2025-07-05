import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { DoctorContext } from "../../context/doctorContext";
import { AppContext } from "../../context/appContext";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  User, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Eye,
  Sparkles,
  AlertCircle
} from "lucide-react";

const DoctorAppointment = () => {
  const {
    dToken,
    getProfileData,
    appointments,
    getAppointments,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency, Loader } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (dToken) {
      getProfileData();
      getAppointments();
    }
  }, [dToken]);

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

  const getStatusColor = (item) => {
    if (item.cancelled) return "text-red-600 bg-red-100";
    if (item.isCompleted) return "text-green-600 bg-green-100";
    return "text-yellow-600 bg-yellow-100";
  };

  const getStatusText = (item) => {
    if (item.cancelled) return "Cancelled";
    if (item.isCompleted) return "Completed";
    return "Pending";
  };

  const getStatusIcon = (item) => {
    if (item.cancelled) return XCircle;
    if (item.isCompleted) return CheckCircle;
    return AlertCircle;
  };

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <Calendar className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage your patient appointments ({appointments?.length || 0} total)</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="hidden sm:block ml-auto"
          >
            <Sparkles className="text-blue-500" size={24} />
          </motion.div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <motion.button
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={16} />
            <span className="hidden sm:inline">Search</span>
          </motion.button>
          <motion.button
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Appointments Table */}
      <motion.div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        variants={itemVariants}
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Calendar className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Appointments Overview</h2>
              <p className="text-gray-600 text-sm sm:text-base">All your scheduled appointments</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {/* Desktop Header */}
          <div className="hidden lg:grid grid-cols-7 gap-4 p-6 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                #
              </span>
              Serial
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              Patient
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              Age
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              Date & Time
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} />
              Amount
            </div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {/* Content */}
          <div className="divide-y divide-gray-100">
            {!appointments || appointments.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-500 font-medium">No appointments found</p>
                  <p className="text-sm text-gray-400">Your appointments will appear here</p>
                </div>
              </div>
            ) : (
              appointments.reverse().map((item, index) => {
                const StatusIcon = getStatusIcon(item);
                return (
                  <motion.div
                    key={index}
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    {/* Desktop Layout */}
                    <div className="hidden lg:grid grid-cols-7 gap-4 items-center">
                      <div className="font-semibold text-gray-900">#{index + 1}</div>
                      
                      <div className="flex items-center gap-3">
                        <motion.img
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          src={item.userData.image}
                          alt={item.userData.name}
                          whileHover={{ scale: 1.1 }}
                        />
                        <span className="font-medium text-gray-900">{item.userData.name}</span>
                      </div>
                      
                      <div className="text-gray-600">{calculateAge(item.userData.dob)} years</div>
                      
                      <div className="text-gray-600">
                        <div className="font-medium">{slotDateFormat(item.slotDate)}</div>
                        <div className="text-sm text-gray-500">{item.slotTime}</div>
                      </div>
                      
                      <div className="font-semibold text-gray-900">
                        {currency} {item.amount}
                      </div>
                      
                      <div>
                        <motion.div 
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item)}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <StatusIcon size={14} />
                          {getStatusText(item)}
                        </motion.div>
                      </div>
                      
                      <div>
                        <motion.button
                          onClick={() => navigate(`/appointments/${item._id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200 font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye size={16} />
                          View Details
                        </motion.button>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.img
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            src={item.userData.image}
                            alt={item.userData.name}
                            whileHover={{ scale: 1.1 }}
                          />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{item.userData.name}</p>
                            <p className="text-xs text-gray-600">{calculateAge(item.userData.dob)} years old</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500 mb-1">Date & Time</p>
                          <p className="font-medium text-gray-900">{slotDateFormat(item.slotDate)}</p>
                          <p className="text-gray-600">{item.slotTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Amount</p>
                          <p className="font-medium text-gray-900">{currency} {item.amount}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <motion.div 
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item)}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <StatusIcon size={12} />
                          {getStatusText(item)}
                        </motion.div>
                        
                        <motion.button
                          onClick={() => navigate(`/appointments/${item._id}`)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-xs font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye size={12} />
                          View
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DoctorAppointment;