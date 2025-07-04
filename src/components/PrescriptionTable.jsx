import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { DoctorContext } from "../context/doctorContext";
import { Plus, Save, Trash2, Pill, Clock, FileText, Sparkles } from "lucide-react";

const PrescriptionTable = ({ appointmentId }) => {
  const [medicines, setMedicines] = useState([
    { name: "", dose: "", duration: "", remarks: "" },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const { backendUrl, dToken } = useContext(DoctorContext);

  const addNewRow = () => {
    setMedicines([...medicines, { name: "", dose: "", duration: "", remarks: "" }]);
    toast.success("New medicine row added!", {
      icon: "💊",
      style: {
        borderRadius: "12px",
        background: "#10b981",
        color: "#fff",
      },
    });
  };

  const removeRow = (index) => {
    if (medicines.length > 1) {
      const updatedMedicines = medicines.filter((_, i) => i !== index);
      setMedicines(updatedMedicines);
      toast.success("Medicine removed!", {
        icon: "🗑️",
        style: {
          borderRadius: "12px",
          background: "#ef4444",
          color: "#fff",
        },
      });
    }
  };

  const handleChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const savePrescription = async () => {
    setIsSaving(true);
    const loadingToast = toast.loading("Saving prescription...", {
      style: {
        borderRadius: "12px",
        background: "#3b82f6",
        color: "#fff",
      },
    });
    
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/create-prescription",
        {
          appointmentId,
          medicines,
        },
        { headers: { dToken } }
      );

      if (data.success) {
        setMedicines([
          { name: "", dose: "", duration: "", remarks: "" },
        ]);
        toast.success("Prescription saved successfully!", { 
          id: loadingToast,
          icon: "✅",
          style: {
            borderRadius: "12px",
            background: "#10b981",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save prescription", { 
        id: loadingToast,
        style: {
          borderRadius: "12px",
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8">
        <div className="flex items-center gap-4">
          <motion.div 
            className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FileText className="text-white" size={28} />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Prescription Writer</h2>
            <p className="text-blue-100 text-lg">Create and manage patient prescriptions with ease</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="ml-auto"
          >
            <Sparkles className="text-white/60" size={24} />
          </motion.div>
        </div>
      </div>

      <div className="p-8">
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="text-left py-5 px-6 font-bold text-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      #
                    </span>
                    Sl. No
                  </div>
                </th>
                <th className="text-left py-5 px-6 font-bold text-gray-800">
                  <div className="flex items-center gap-3">
                    <Pill size={18} className="text-blue-600" />
                    Medicine Name
                  </div>
                </th>
                <th className="text-left py-5 px-6 font-bold text-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-green-100 rounded-full border-2 border-green-500"></span>
                    Dose
                  </div>
                </th>
                <th className="text-left py-5 px-6 font-bold text-gray-800">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-blue-600" />
                    Duration
                  </div>
                </th>
                <th className="text-left py-5 px-6 font-bold text-gray-800">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-blue-600" />
                    Remarks
                  </div>
                </th>
                <th className="text-left py-5 px-6 font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {medicines.map((med, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                  >
                    <td className="py-5 px-6">
                      <motion.div 
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {index + 1}
                      </motion.div>
                    </td>
                    <td className="py-5 px-6">
                      <motion.input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-blue-300"
                        placeholder="Enter medicine name"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </td>
                    <td className="py-5 px-6">
                      <motion.input
                        type="text"
                        value={med.dose}
                        onChange={(e) => handleChange(index, "dose", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-blue-300"
                        placeholder="e.g., 500mg"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </td>
                    <td className="py-5 px-6">
                      <motion.input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleChange(index, "duration", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-blue-300"
                        placeholder="e.g., 7 days"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </td>
                    <td className="py-5 px-6">
                      <motion.input
                        type="text"
                        value={med.remarks}
                        onChange={(e) => handleChange(index, "remarks", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-blue-300"
                        placeholder="After meals"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </td>
                    <td className="py-5 px-6">
                      {medicines.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeRow(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 border-2 border-transparent hover:border-red-200"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-10 pt-8 border-t border-gray-200">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={addNewRow}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus size={22} />
            Add Medicine
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={savePrescription}
            disabled={isSaving}
            className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={22} />
            {isSaving ? "Saving..." : "Save & Generate PDF"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PrescriptionTable;