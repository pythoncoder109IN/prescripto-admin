import axios from "axios";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { assets } from "../../assets/assets";
import { AppContext } from "../../context/appContext";
import { DoctorContext } from "../../context/doctorContext";
import PrescriptionTable from "../../components/PrescriptionTable";
import { 
  User, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Video,
  Download,
  Eye,
  Sparkles,
  CreditCard,
  Users
} from "lucide-react";

const AppointmentPage = () => {
  const { appointmentId } = useParams();
  const { Loader, slotDateFormat } = useContext(AppContext);
  const {
    backendUrl,
    dToken,
    cancelAppointment,
    completeAppointment,
    joinMeeting,
  } = useContext(DoctorContext);
  const [appointmentData, setAppointmentData] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const getAppointmentData = async () => {
    const { data } = await axios.post(
      backendUrl + "/api/doctor/get-appointment",
      { appointmentId },
      { headers: { dToken } }
    );
    setAppointmentData(data.appointment);
  };

  const getUploadedFiles = async () => {
    const { data } = await axios.post(
      backendUrl + "/api/doctor/get-files",
      { appointmentId },
      { headers: { dToken } }
    );
    setUploadedFiles(data.files);
  };

  const prescriptionFiles = uploadedFiles.filter((file) =>
    file.name.toLowerCase().includes("prescription.pdf")
  );

  const otherUploadedFiles = uploadedFiles.filter(
    (file) => !file.name.toLowerCase().includes("prescription.pdf")
  );

  useEffect(() => {
    if (dToken) {
      getAppointmentData();
      getUploadedFiles();
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

  if (!appointmentData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6 lg:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <Calendar className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Appointment Details</h1>
            <p className="text-gray-600 text-sm sm:text-base">Comprehensive patient appointment information</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="hidden sm:block"
        >
          <Sparkles className="text-blue-500" size={24} />
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 sm:items-center">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-0">Quick Actions:</h3>
          {appointmentData.cancelled ? (
            <motion.div 
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium text-sm sm:text-base"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <XCircle size={16} />
              Appointment Cancelled
            </motion.div>
          ) : appointmentData.isCompleted ? (
            <motion.div 
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium text-sm sm:text-base"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <CheckCircle size={16} />
              Appointment Completed
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
              <motion.button
                onClick={() => completeAppointment(appointmentData._id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle size={16} />
                Complete
              </motion.button>
              <motion.button
                onClick={() => cancelAppointment(appointmentData._id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <XCircle size={16} />
                Cancel
              </motion.button>
              <motion.button
                onClick={() => joinMeeting(appointmentData._id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Video size={16} />
                Join Meeting
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Patient Information */}
        <motion.div 
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <User className="text-white" size={18} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Patient Information</h3>
                <p className="text-gray-600 text-sm">Personal and contact details</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <motion.img
                src={appointmentData.userData.image}
                alt={appointmentData.userData.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto sm:mx-0"
                whileHover={{ scale: 1.1 }}
              />
              <div className="text-center sm:text-left">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">{appointmentData.userData.name}</h4>
                <p className="text-gray-600 text-sm sm:text-base">{appointmentData.userData.gender}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="text-blue-600" size={14} />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Email</span>
                </div>
                <p className="text-gray-900 font-medium text-sm break-all">{appointmentData.userData.email}</p>
              </div>

              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="text-green-600" size={14} />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Phone</span>
                </div>
                <p className="text-gray-900 font-medium text-sm">{appointmentData.userData.phone}</p>
              </div>

              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-purple-600" size={14} />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Date of Birth</span>
                </div>
                <p className="text-gray-900 font-medium text-sm">{appointmentData.userData.dob}</p>
              </div>

              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-orange-600" size={14} />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Gender</span>
                </div>
                <p className="text-gray-900 font-medium text-sm">{appointmentData.userData.gender}</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="text-red-600" size={14} />
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Address</span>
              </div>
              <p className="text-gray-900 font-medium text-sm">
                {appointmentData.userData.address.line1}, {appointmentData.userData.address.line2}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Appointment Details */}
        <motion.div 
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-xl">
                <Calendar className="text-white" size={18} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Appointment Details</h3>
                <p className="text-gray-600 text-sm">Schedule and payment information</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-blue-600" size={14} />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Date</span>
                </div>
                <p className="text-gray-900 font-medium text-sm">{slotDateFormat(appointmentData.slotDate)}</p>
              </div>

              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-purple-600" size={14} />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Time</span>
                </div>
                <p className="text-gray-900 font-medium text-sm">{appointmentData.slotTime}</p>
              </div>

              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="text-green-600" size={14} />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Payment Status</span>
                </div>
                <div className="flex items-center gap-2">
                  {appointmentData.payment ? (
                    <>
                      <CheckCircle className="text-green-600" size={14} />
                      <span className="text-green-600 font-medium text-sm">Paid</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-600" size={14} />
                      <span className="text-red-600 font-medium text-sm">Not Paid</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Uploaded Documents */}
            {otherUploadedFiles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <FileText className="text-blue-600" size={18} />
                  <h4 className="text-base sm:text-lg font-bold text-gray-900">Uploaded Documents</h4>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {otherUploadedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {file.name.split("/")[1] || file.name}
                          </p>
                          <p className="text-xs text-gray-600">Document</p>
                        </div>
                        <motion.button
                          onClick={() => window.open(file.url, "_blank")}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-xs ml-3"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye size={12} />
                          View
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Prescription Files */}
            {prescriptionFiles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <FileText className="text-green-600" size={18} />
                  <h4 className="text-base sm:text-lg font-bold text-gray-900">Prescriptions</h4>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {prescriptionFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      className="p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow duration-200"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {file.name.split("/")[1] || file.name}
                          </p>
                          <p className="text-xs text-green-600">Prescription</p>
                        </div>
                        <motion.button
                          onClick={() => window.open(file.url, "_blank")}
                          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-xs ml-3"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye size={12} />
                          View
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Prescription Table Section */}
      {!appointmentData.isCompleted && !appointmentData.cancelled && (
        <motion.div variants={itemVariants}>
          <PrescriptionTable appointmentId={appointmentId} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default AppointmentPage;