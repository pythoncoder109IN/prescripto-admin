import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminContext } from "../../context/adminContext";
import { AppContext } from "../../context/appContext";
import { assets } from "../../assets/assets";
import { 
  Calendar, 
  User, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Search,
  Filter
} from "lucide-react";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency, Loader } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

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
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">All Appointments</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage and track all patient appointments</p>
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
              <p className="text-gray-600 text-sm sm:text-base">Total: {appointments.length} appointments</p>
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
              <User size={16} />
              Doctor
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} />
              Fees
            </div>
            <div>Actions</div>
          </div>

          {/* Content */}
          <div className="divide-y divide-gray-100">
            {appointments.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader />
              </div>
            ) : (
              appointments.map((item, index) => (
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
                    
                    <div className="flex items-center gap-3">
                      <motion.img
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        src={item.docData.image}
                        alt={item.docData.name}
                        whileHover={{ scale: 1.1 }}
                      />
                      <span className="font-medium text-gray-900">{item.docData.name}</span>
                    </div>
                    
                    <div className="font-semibold text-gray-900">
                      {currency} {item.docData.fees}
                    </div>
                    
                    <div>
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
                          <p className="font-semibold text-gray-900">{item.userData.name}</p>
                          <p className="text-sm text-gray-600">{calculateAge(item.userData.dob)} years old</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Date & Time</p>
                        <p className="font-medium text-gray-900">{slotDateFormat(item.slotDate)}</p>
                        <p className="text-gray-600">{item.slotTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Doctor</p>
                        <p className="font-medium text-gray-900">{item.docData.name}</p>
                        <p className="text-gray-600">{currency} {item.docData.fees}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <motion.img
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          src={item.docData.image}
                          alt={item.docData.name}
                          whileHover={{ scale: 1.1 }}
                        />
                        <span className="text-sm text-gray-600">Dr. {item.docData.name}</span>
                      </div>
                      
                      {item.cancelled ? (
                        <motion.div 
                          className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <XCircle size={12} />
                          Cancelled
                        </motion.div>
                      ) : item.isCompleted ? (
                        <motion.div 
                          className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <CheckCircle size={12} />
                          Completed
                        </motion.div>
                      ) : (
                        <motion.button
                          onClick={() => cancelAppointment(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img src={assets.cancel_icon} className="w-5 h-5" alt="Cancel" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AllAppointments;