import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Filter,
  X,
  ChevronDown,
  Sparkles
} from "lucide-react";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency, Loader } = useContext(AppContext);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // Get unique doctors for filter
  const uniqueDoctors = [...new Set(appointments?.map(app => app.docData.name) || [])];

  // Filter and Search Logic
  const filteredAppointments = appointments?.filter((appointment) => {
    // Search filter
    const searchMatch = !searchTerm ||
      appointment.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.userData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.userData.phone.includes(searchTerm) ||
      appointment.docData.name.toLowerCase().includes(searchTerm.toLowerCase());

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
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      switch (dateFilter) {
        case "today":
          dateMatch = appointmentDate.toDateString() === today.toDateString();
          break;
        case "tomorrow":
          dateMatch = appointmentDate.toDateString() === tomorrow.toDateString();
          break;
        default:
          dateMatch = true;
      }
    }

    // Doctor filter
    const doctorMatch = doctorFilter === "all" || appointment.docData.name === doctorFilter;

    return searchMatch && statusMatch && dateMatch && doctorMatch;
  }) || [];

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
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <Calendar className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Appointments</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage and track all patient appointments ({filteredAppointments.length} of {appointments?.length || 0} shown)
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
        
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <motion.button
            onClick={() => setShowSearch(!showSearch)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={16} />
            <span className="hidden sm:inline">Search</span>
          </motion.button>
          
          <div className="relative">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Filter by Status</p>
                  </div>
                  
                  {['all', 'pending', 'completed', 'cancelled'].map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                        statusFilter === status 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      whileHover={{ backgroundColor: statusFilter === status ? "#dbeafe" : "#f9fafb" }}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)} {status === 'all' ? 'Status' : ''}
                    </motion.button>
                  ))}

                  <div className="px-3 py-2 border-t border-gray-100 mt-2">
                    <p className="text-sm font-semibold text-gray-900">Filter by Date</p>
                  </div>
                  
                  {['all', 'today', 'tomorrow'].map((date) => (
                    <motion.button
                      key={date}
                      onClick={() => {
                        setDateFilter(date);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                        dateFilter === date 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      whileHover={{ backgroundColor: dateFilter === date ? "#dbeafe" : "#f9fafb" }}
                    >
                      {date.charAt(0).toUpperCase() + date.slice(1)} {date === 'all' ? 'Dates' : ''}
                    </motion.button>
                  ))}

                  {uniqueDoctors.length > 0 && (
                    <>
                      <div className="px-3 py-2 border-t border-gray-100 mt-2">
                        <p className="text-sm font-semibold text-gray-900">Filter by Doctor</p>
                      </div>
                      
                      <motion.button
                        onClick={() => {
                          setDoctorFilter("all");
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                          doctorFilter === "all" 
                            ? 'bg-blue-50 text-blue-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        whileHover={{ backgroundColor: doctorFilter === "all" ? "#dbeafe" : "#f9fafb" }}
                      >
                        All Doctors
                      </motion.button>
                      
                      {uniqueDoctors.slice(0, 5).map((doctor) => (
                        <motion.button
                          key={doctor}
                          onClick={() => {
                            setDoctorFilter(doctor);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                            doctorFilter === doctor 
                              ? 'bg-blue-50 text-blue-600 font-medium' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          whileHover={{ backgroundColor: doctorFilter === doctor ? "#dbeafe" : "#f9fafb" }}
                        >
                          Dr. {doctor}
                        </motion.button>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by patient name, email, phone, or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                autoFocus
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
          </motion.div>
        )}
      </AnimatePresence>

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
            {filteredAppointments.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  {appointments?.length === 0 ? (
                    <>
                      <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500 font-medium">No appointments found</p>
                      <p className="text-sm text-gray-400">Appointments will appear here when patients book</p>
                    </>
                  ) : (
                    <>
                      <Search className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500 font-medium">No appointments match your criteria</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              filteredAppointments.map((item, index) => (
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