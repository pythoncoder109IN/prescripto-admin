import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../context/adminContext";
import { AppContext } from "../../context/appContext";
import { DoctorContext } from "../../context/doctorContext";
import { 
  User, 
  Mail, 
  Shield, 
  Stethoscope, 
  Edit3, 
  Save, 
  X,
  Lock,
  Sparkles
} from "lucide-react";

const AdminProfile = () => {
  const { aToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(AdminContext);
  const { Loader } = useContext(AppContext);
  const { profileData: docData } = useContext(DoctorContext);

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async () => {
    try {
      setIsLoading(true);
      const updateData = {
        name: profileData.name,
        password: profileData.password,
      };

      const { data } = await axios.post(
        backendUrl + "/api/admin/update-profile",
        updateData,
        { headers: { aToken } }
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
    if (aToken) {
      getProfileData();
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

  const currentUser = aToken && profileData ? profileData : docData;
  const userType = aToken ? "Admin" : "Doctor";
  const UserIcon = aToken ? Shield : Stethoscope;

  return (
    <motion.div 
      className="max-w-4xl mx-auto space-y-6 sm:space-y-8"
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
            <UserIcon className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage your account information and preferences</p>
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

      {currentUser ? (
        <motion.div 
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          variants={itemVariants}
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="text-white" size={28} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                </div>
              </motion.div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  {isEdit ? (
                    <motion.input
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      whileFocus={{ scale: 1.02 }}
                    />
                  ) : (
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                      Welcome, {currentUser.name}
                    </h2>
                  )}
                  
                  <motion.div
                    className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs sm:text-sm font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <UserIcon size={12} />
                    {userType}
                  </motion.div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} />
                  <span className="font-medium text-sm sm:text-base">{currentUser.email}</span>
                </div>
              </div>

              {aToken && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
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
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-4 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Account Information */}
              <motion.div 
                className="space-y-4 sm:space-y-6"
                variants={itemVariants}
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Account Information</h3>
                
                <div className="space-y-4">
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      <User className="inline mr-2" size={14} />
                      Full Name
                    </label>
                    <p className="text-gray-900 font-medium text-sm sm:text-base">{currentUser.name}</p>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="inline mr-2" size={14} />
                      Email Address
                    </label>
                    <p className="text-gray-900 font-medium text-sm sm:text-base">{currentUser.email}</p>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      <UserIcon className="inline mr-2" size={14} />
                      Account Type
                    </label>
                    <p className="text-gray-900 font-medium text-sm sm:text-base">{userType}</p>
                  </div>
                </div>
              </motion.div>

              {/* Security Settings */}
              {aToken && isEdit && (
                <motion.div 
                  className="space-y-4 sm:space-y-6"
                  variants={itemVariants}
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="inline mr-2" size={14} />
                        Update Password
                      </label>
                      <motion.input
                        type="password"
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        value={profileData.password || ''}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter new password"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Account Stats */}
              <motion.div 
                className="space-y-4 sm:space-y-6"
                variants={itemVariants}
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Account Status</h3>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs sm:text-sm font-semibold text-green-700">Status</span>
                    </div>
                    <p className="text-green-900 font-bold text-sm sm:text-base">Active</p>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="text-blue-600" size={12} />
                      <span className="text-xs sm:text-sm font-semibold text-blue-700">Security</span>
                    </div>
                    <p className="text-blue-900 font-bold text-sm sm:text-base">Verified</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      )}
    </motion.div>
  );
};

export default AdminProfile;