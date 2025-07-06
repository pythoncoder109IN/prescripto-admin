import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminContext } from '../../context/adminContext';
import { AppContext } from '../../context/appContext';
import { 
  Users, 
  Stethoscope, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  Sparkles,
  MapPin,
  GraduationCap,
  X,
  DollarSign,
  Clock,
  ChevronDown
} from 'lucide-react';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);
  const { Loader, currency } = useContext(AppContext);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  // Get unique specialities for filter
  const uniqueSpecialities = [...new Set(doctors?.map(doc => doc.speciality) || [])];

  // Filter and Search Logic
  const filteredDoctors = doctors?.filter((doctor) => {
    // Search filter
    const searchMatch = !searchTerm ||
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.degree.toLowerCase().includes(searchTerm.toLowerCase());

    // Speciality filter
    const specialityMatch = specialityFilter === "all" || doctor.speciality === specialityFilter;

    // Availability filter
    let availabilityMatch = true;
    if (availabilityFilter === "available") {
      availabilityMatch = doctor.available;
    } else if (availabilityFilter === "unavailable") {
      availabilityMatch = !doctor.available;
    }

    return searchMatch && specialityMatch && availabilityMatch;
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
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
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Doctors</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your medical team ({filteredDoctors.length} of {doctors?.length || 0} shown)
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
                    <p className="text-sm font-semibold text-gray-900">Filter by Speciality</p>
                  </div>
                  
                  <motion.button
                    onClick={() => {
                      setSpecialityFilter("all");
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                      specialityFilter === "all" 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ backgroundColor: specialityFilter === "all" ? "#dbeafe" : "#f9fafb" }}
                  >
                    All Specialities
                  </motion.button>
                  
                  {uniqueSpecialities.slice(0, 5).map((speciality) => (
                    <motion.button
                      key={speciality}
                      onClick={() => {
                        setSpecialityFilter(speciality);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                        specialityFilter === speciality 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      whileHover={{ backgroundColor: specialityFilter === speciality ? "#dbeafe" : "#f9fafb" }}
                    >
                      {speciality}
                    </motion.button>
                  ))}

                  <div className="px-3 py-2 border-t border-gray-100 mt-2">
                    <p className="text-sm font-semibold text-gray-900">Filter by Availability</p>
                  </div>
                  
                  {['all', 'available', 'unavailable'].map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => {
                        setAvailabilityFilter(status);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                        availabilityFilter === status 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      whileHover={{ backgroundColor: availabilityFilter === status ? "#dbeafe" : "#f9fafb" }}
                    >
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </motion.button>
                  ))}
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
                placeholder="Search by name, email, speciality, or degree..."
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

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            {doctors?.length === 0 ? (
              <>
                <Users className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 font-medium">No doctors found</p>
                <p className="text-sm text-gray-400">Add doctors to your medical team</p>
              </>
            ) : (
              <>
                <Search className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 font-medium">No doctors match your criteria</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
        >
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor._id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Doctor Image */}
              <div className="relative overflow-hidden">
                <motion.img
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  src={doctor.image}
                  alt={doctor.name}
                  whileHover={{ scale: 1.1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Availability Badge */}
                <motion.div
                  className={`absolute top-3 sm:top-4 right-3 sm:right-4 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                    doctor.available
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {doctor.available ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle size={10} />
                      <span className="hidden sm:inline">Available</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <XCircle size={10} />
                      <span className="hidden sm:inline">Unavailable</span>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Doctor Info */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Stethoscope size={14} />
                    <span className="font-medium text-sm">{doctor.speciality}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={12} />
                    <span>{doctor.degree}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    <span>{doctor.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={12} />
                    <span>{currency} {doctor.fees}</span>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Availability</span>
                    <motion.label 
                      className="relative inline-flex items-center cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <input
                        type="checkbox"
                        checked={doctor.available}
                        onChange={() => changeAvailability(doctor._id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </motion.label>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DoctorsList;