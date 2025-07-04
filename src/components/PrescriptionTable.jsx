import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { DoctorContext } from "../context/doctorContext";
import { Plus, Save, Trash2, Pill, Clock, FileText } from "lucide-react";

const PrescriptionTable = ({ appointmentId }) => {
  const [medicines, setMedicines] = useState([
    { name: "", dose: "", duration: "", remarks: "" },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const { backendUrl, dToken } = useContext(DoctorContext);

  const addNewRow = () => {
    setMedicines([...medicines, { name: "", dose: "", duration: "", remarks: "" }]);
  };

  const removeRow = (index) => {
    if (medicines.length > 1) {
      const updatedMedicines = medicines.filter((_, i) => i !== index);
      setMedicines(updatedMedicines);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const savePrescription = async () => {
    setIsSaving(true);
    const loadingToast = toast.loading("Saving prescription...");
    
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
        toast.success("Prescription saved successfully!", { id: loadingToast });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save prescription", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-large border border-gray-100 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <FileText className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Prescription Writer</h2>
            <p className="text-primary-100">Create and manage patient prescriptions</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                      #
                    </span>
                    Sl. No
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Pill size={16} className="text-primary-600" />
                    Medicine Name
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 rounded-full"></span>
                    Dose
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary-600" />
                    Duration
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary-600" />
                    Remarks
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
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
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder="Enter medicine name"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="text"
                        value={med.dose}
                        onChange={(e) => handleChange(index, "dose", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder="e.g., 500mg"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleChange(index, "duration", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder="e.g., 7 days"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="text"
                        value={med.remarks}
                        onChange={(e) => handleChange(index, "remarks", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder="After meals"
                      />
                    </td>
                    <td className="py-4 px-4">
                      {medicines.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeRow(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addNewRow}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus size={20} />
            Add Medicine
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={savePrescription}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isSaving ? "Saving..." : "Save & Generate PDF"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PrescriptionTable;