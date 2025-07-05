import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DoctorContext } from "../../context/doctorContext";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  User, 
  Mail, 
  Stethoscope, 
  Edit3, 
  Save, 
  X,
  MapPin,
  GraduationCap,
  DollarSign,
  Clock,
  FileText,
  Sparkles,
  CheckCircle,
  Star
} from "lucide-react";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency, Loader } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async () => {
    try {
      setIsLoading(true);
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success("Profile updated successfully! 🎉", {
          style: {
            borderRadius: "12px",
            background: "#10b981",
            color: "#fff",
          },
        });
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message, {
          style: {
            borderRadius: "12px",
            background: "#ef4444",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        style: {
          borderRadius: "12px",
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelUpdateProfile = () => {
    try {
      getProfileData();
      setIsEdit(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        style: {
          borderRadius: "12px",
          background: "#ef4444",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
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

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-6 sm:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="mb-6 sm:mb-8"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <Stethoscope className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Doctor Profile</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage your professional information and settings</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="hidden sm:block"
          >
            <Sparkles className="text-blue-500" size={24} />
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Profile Image and Basic Info */}
        <motion.div 
          className="lg:col-span-1"
          variants={itemVariants}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
              <div className="text-center">
                <motion.div 
                  className="relative inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto"
                    src={profileData.image}
                    alt={profileData.name}
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <CheckCircle className="text-white" size={12} />
                  </div>
                </motion.div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">{profileData.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Stethoscope className="text-blue-600" size={14} />
                  <span className="text-blue-600 font-semibold text-sm">{profileData.speciality}</span>
                </div>
                
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={14} />
                  ))}
                  <span className="text-xs text-gray-600 ml-2">(4.9)</span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <GraduationCap className="text-blue-600" size={18} />
                <div>
                  <p className="text-xs text-gray-600">Education</p>
                  <p className="font-semibold text-gray-900 text-sm">{profileData.degree}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Clock className="text-green-600" size={18} />
                <div>
                  <p className="text-xs text-gray-600">Experience</p>
                  <p className="font-semibold text-gray-900 text-sm">{profileData.experience}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <DollarSign className="text-purple-600" size={18} />
                <div>
                  <p className="text-xs text-gray-600">Consultation Fee</p>
                  <p className="font-semibold text-gray-900 text-sm">{currency} {profileData.fees}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={18} />
                  <span className="font-semibold text-gray-900 text-sm">Available for appointments</span>
                </div>
                <motion.label 
                  className="relative inline-flex items-center cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <input
                    type="checkbox"
                    onChange={() =>
                      isEdit &&
                      setProfileData((prev) => ({
                        ...prev,
                        available: !prev.available,
                      }))
                    }
                    checked={profileData.available}
                    disabled={!isEdit}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </motion.label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Information */}
        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Professional Information</h3>
                  <p className="text-gray-600 text-sm">Manage your professional details</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  {isEdit ? (
                    <>
                      <motion.button
                        onClick={cancelUpdateProfile}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={14} />
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={updateProfile}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isLoading ? (
                          <Loader color="#ffffff" />
                        ) : (
                          <>
                            <Save size={14} />
                            Save Changes
                          </>
                        )}
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      onClick={() => setIsEdit(true)}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit3 size={14} />
                      Edit Profile
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* About Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <FileText className="inline mr-2" size={14} />
                  About Doctor
                </label>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{profileData.about}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Mail className="inline mr-2" size={14} />
                    Email Address
                  </label>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-900 font-medium text-sm break-all">{profileData.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <DollarSign className="inline mr-2" size={14} />
                    Consultation Fee
                  </label>
                  {isEdit ? (
                    <motion.input
                      type="number"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          fees: e.target.value,
                        }))
                      }
                      value={profileData.fees}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                      placeholder="Enter consultation fee"
                      whileFocus={{ scale: 1.02 }}
                    />
                  ) : (
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-900 font-medium text-sm">{currency} {profileData.fees}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <MapPin className="inline mr-2" size={14} />
                  Clinic Address
                </label>
                {isEdit ? (
                  <div className="space-y-3">
                    <motion.input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                      value={profileData.address.line1}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                      placeholder="Address Line 1"
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                      value={profileData.address.line2}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                      placeholder="Address Line 2"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                ) : (
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-900 font-medium text-sm">
                      {profileData.address.line1}
                      {profileData.address.line2 && (
                        <>
                          <br />
                          {profileData.address.line2}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">150+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Patients Treated</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-green-50 rounded-xl">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">98%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-xl">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">5+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DoctorProfile;