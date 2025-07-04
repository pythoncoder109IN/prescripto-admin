import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  GraduationCap
} from 'lucide-react';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);
  const { Loader } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Doctors</h1>
            <p className="text-gray-600">Manage your medical team ({doctors.length} doctors)</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="ml-auto"
          >
            <Sparkles className="text-blue-500" size={24} />
          </motion.div>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={18} />
            Search
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={18} />
            Filter
          </motion.button>
        </div>
      </motion.div>

      {/* Doctors Grid */}
      {doctors.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {doctors.map((doctor, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Doctor Image */}
              <div className="relative overflow-hidden">
                <motion.img
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  src={doctor.image}
                  alt={doctor.name}
                  whileHover={{ scale: 1.1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Availability Badge */}
                <motion.div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
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
                      <CheckCircle size={12} />
                      Available
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <XCircle size={12} />
                      Unavailable
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Doctor Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Stethoscope size={16} />
                    <span className="font-medium">{doctor.speciality}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} />
                    <span>{doctor.degree}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{doctor.experience}</span>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Availability</span>
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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