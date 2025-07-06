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
  SlidersHorizontal,
  DollarSign,
  Clock
} from 'lucide-react';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);
  const { Loader, currency } = useContext(AppContext);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
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
    const searchMatch = 
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

    // Experience filter
    let experienceMatch = true;
    if (experienceFilter !== "all") {
      const expYears = parseInt(doctor.experience.split(' ')[0]);
      switch (experienceFilter) {
        case "1-3":
          experienceMatch = expYears >= 1 && expYears <= 3;
          break;
        case "4-7":
          experienceMatch = expYears >= 4 && expYears <= 7;
          break;
        case "8+":
          experienceMatch = expYears >= 8;
          break;
        default:
          experienceMatch = true;
      }
    }

    return searchMatch && specialityMatch && availabilityMatch && experienceMatch;
  }) || [];

  const clearFilters = () => {
    setSearchTerm("");
    setSpecialityFilter("all");
    setAvailabilityFilter("all");
    setExperienceFilter("all");
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
                placeholder="Search by name, email, speciality, or degree..."
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
              >
                {/* Speciality Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Speciality</label>
                  <select
                    value={specialityFilter}
                    onChange={(e) => setSpecialityFilter(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="all">All Specialities</option>
                    {uniqueSpecialities.map((speciality, index) => (
                      <option key={index} value={speciality}>{speciality}</option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="all">All Experience</option>
                    <option value="1-3">1-3 Years</option>
                    <option value="4-7">4-7 Years</option>
                    <option value="8+">8+ Years</option>
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
          {(searchTerm || specialityFilter !== "all" || availabilityFilter !== "all" || experienceFilter !== "all") && (
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
              {specialityFilter !== "all" && (
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span>Speciality: {specialityFilter}</span>
                  <button onClick={() => setSpecialityFilter("all")}>
                    <X size={12} />
                  </button>
                </motion.div>
              )}
              {availabilityFilter !== "all" && (
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span>Status: {availabilityFilter}</span>
                  <button onClick={() => setAvailabilityFilter("all")}>
                    <X size={12} />
                  </button>
                </motion.div>
              )}
              {experienceFilter !== "all" && (
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span>Experience: {experienceFilter} years</span>
                  <button onClick={() => setExperienceFilter("all")}>
                    <X size={12} />
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>

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
                <p className="text-gray-500 font-medium">No doctors match your search</p>
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