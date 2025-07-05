import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/adminContext";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContext } from "../../context/appContext";
import { 
  Upload, 
  User, 
  Mail, 
  Lock, 
  GraduationCap, 
  DollarSign, 
  MapPin, 
  FileText,
  Stethoscope,
  Calendar,
  Save,
  Sparkles
} from "lucide-react";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { aToken, backendUrl } = useContext(AdminContext);
  const { Loader } = useContext(AppContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      if (!docImg) {
        toast.error('Please select a doctor image', {
          style: {
            borderRadius: "12px",
            background: "#ef4444",
            color: "#fff",
          },
        });
        return;
      }

      const formData = new FormData();
      formData.append('adminId', '');
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', fees);
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({line1: address1, line2: address2}));

      const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {headers: {aToken}});
      
      if (data.success) {
        toast.success('Doctor added successfully! 🎉', {
          style: {
            borderRadius: "12px",
            background: "#10b981",
            color: "#fff",
          },
        });
        
        // Reset form
        setDocImg(false);
        setName('');
        setEmail('');
        setPassword('');
        setExperience('1 Year');
        setFees('');
        setAbout('');
        setSpeciality('General physician');
        setDegree('');
        setAddress1('');
        setAddress2('');
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Doctor</h1>
            <p className="text-gray-600 text-sm sm:text-base">Create a new doctor profile for your medical team</p>
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

      <form onSubmit={submitHandler}>
        <motion.div 
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-8 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Doctor Information</h2>
            
            {/* Upload Doctor Picture Section */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              whileHover={{ scale: 1.02 }}
            >
              <motion.label 
                htmlFor="doc-img"
                className="cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <img
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                    src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                    alt="Doctor upload"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Upload className="text-white" size={20} />
                  </div>
                </div>
              </motion.label>
              <input
                onChange={(e) => setDocImg(e.target.files[0])}
                type="file"
                id="doc-img"
                hidden
                accept="image/*"
              />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Upload Doctor Picture</h3>
                <p className="text-sm text-gray-600">Choose a professional photo for the doctor profile</p>
                <p className="text-xs text-gray-500 mt-1">Recommended: 400x400px, JPG or PNG</p>
              </div>
            </motion.div>
          </div>

          <div className="p-4 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="inline mr-2" size={16} />
                    Doctor Name
                  </label>
                  <motion.input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    type="text"
                    placeholder="Enter doctor's full name"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="inline mr-2" size={16} />
                    Email Address
                  </label>
                  <motion.input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    type="email"
                    placeholder="doctor@example.com"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="inline mr-2" size={16} />
                    Password
                  </label>
                  <motion.input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    type="password"
                    placeholder="Create a secure password"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline mr-2" size={16} />
                    Experience
                  </label>
                  <motion.select
                    onChange={(e) => setExperience(e.target.value)}
                    value={experience}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    whileFocus={{ scale: 1.02 }}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={`${i + 1} Year${i > 0 ? 's' : ''}`}>
                        {i + 1} Year{i > 0 ? 's' : ''}
                      </option>
                    ))}
                  </motion.select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="inline mr-2" size={16} />
                    Consultation Fees
                  </label>
                  <motion.input
                    onChange={(e) => setFees(e.target.value)}
                    value={fees}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    type="number"
                    placeholder="Enter consultation fees"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Stethoscope className="inline mr-2" size={16} />
                    Speciality
                  </label>
                  <motion.select
                    onChange={(e) => setSpeciality(e.target.value)}
                    value={speciality}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="General physician">General Physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatricians">Pediatricians</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                  </motion.select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap className="inline mr-2" size={16} />
                    Education & Degree
                  </label>
                  <motion.input
                    onChange={(e) => setDegree(e.target.value)}
                    value={degree}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    type="text"
                    placeholder="e.g., MBBS, MD"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="inline mr-2" size={16} />
                    Address
                  </label>
                  <div className="space-y-3">
                    <motion.input
                      onChange={(e) => setAddress1(e.target.value)}
                      value={address1}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      type="text"
                      placeholder="Address Line 1"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.input
                      onChange={(e) => setAddress2(e.target.value)}
                      value={address2}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      type="text"
                      placeholder="Address Line 2"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* About Doctor Section */}
            <motion.div 
              className="mt-6 sm:mt-8"
              variants={itemVariants}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="inline mr-2" size={16} />
                About Doctor
              </label>
              <motion.textarea
                onChange={(e) => setAbout(e.target.value)}
                value={about}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Write a brief description about the doctor's expertise, experience, and approach to patient care..."
                rows={4}
                required
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              className="mt-6 sm:mt-8 flex justify-end"
              variants={itemVariants}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <Loader color="#ffffff" />
                ) : (
                  <>
                    <Save size={20} />
                    Add Doctor
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddDoctor;