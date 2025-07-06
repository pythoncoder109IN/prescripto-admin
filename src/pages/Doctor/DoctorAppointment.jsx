import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertCircle,
  X,
  SlidersHorizontal
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

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (dToken) {
      getProfileData();
      getAppointments();
    }
  }, [dToken]);

  // Filter and Search Logic
  const filteredAppointments = appointments?.filter((appointment) => {
    // Search filter
    const searchMatch = 
      appointment.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.userData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.userData.phone.includes(searchTerm);

    // Status filter
    let statusMatch = true;
    if (statusFilter === "completed") {
      statusMatch = appointment.isCompleted;
    } else if (statusFilter === "cancelled") {
      statusMatch = appointment.cancelled;
    } else if (statusFilter === "pending") {
      statusMatch = !appointment.isCompleted && !appointment.cancelled;
    }

    // Date filter
    let dateMatch = true;
    if (dateFilter !== "all") {
      const appointmentDate = new Date(appointment.slotDate.replace(/_/g, '/'));
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      switch (dateFilter) {
        case "today":
          dateMatch = appointmentDate.toDateString() === today.toDateString();
          break;
        case "yesterday":
          dateMatch = appointmentDate.toDateString() === yesterday.toDateString();
          break;
        case "tomorrow":
          dateMatch = appointmentDate.toDateString() === tomorrow.toDateString();
          break;
        case "week":
          dateMatch = appointmentDate >= today && appointmentDate <= weekFromNow;
          break;
        default:
          dateMatch = true;
      }
    }

    return searchMatch && statusMatch && dateMatch;
  }) || [];

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
  };

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
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your patient appointments ({filteredAppointments.length} of {appointments?.length || 0} shown)
            </p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="hidden sm:block ml-auto"
          >
            <Sparkles className="text-blue-500" size={24} />
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6"
        variants={itemVariants}
      >
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by patient name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {searchTerm && (
                <motion.button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} />
                </motion.button>
              )}
            </div>
            
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                showFilters 
                  ? "bg-blue-500 text-white border-blue-500" 
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
              >
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Next 7 Days</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <motion.button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Filters
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Display */}
          {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span>Search: "{searchTerm}"</span>
                  <button onClick={() => setSearchTerm("")}>
                    <X size={12} />
                  </button>
                </motion.div>
              )}
              {statusFilter !== "all" && (
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span>Status: {statusFilter}</span>
                  <button onClick={() => setStatusFilter("all")}>
                    <X size={12} />
                  </button>
                </motion.div>
              )}
              {dateFilter !== "all" && (
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span>Date: {dateFilter}</span>
                  <button onClick={() => setDateFilter("all")}>
                    <X size={12} />
                  </button>
                </motion.div>
              )}
            </div>
          )}
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
              <p className="text-gray-600 text-sm sm:text-base">
                {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
              </p>
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
            {filteredAppointments.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  {appointments?.length === 0 ? (
                    <>
                      <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500 font-medium">No appointments found</p>
                      <p className="text-sm text-gray-400">Your appointments will appear here</p>
                    </>
                  ) : (
                    <>
                      <Search className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500 font-medium">No appointments match your search</p>
                      <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                      <motion.button
                        onClick={clearFilters}
                        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Clear Filters
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              filteredAppointments.reverse().map((item, index) => {
                const StatusIcon = getStatusIcon(item);
                return (
                  <motion.div
                    key={item._id}
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