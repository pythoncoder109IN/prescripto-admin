import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/doctorContext";

const PrescriptionTable = ({ appointmentId }) => {
  const [medicines, setMedicines] = useState([
    { name: "", dose: "", duration: "", remarks: "" },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const {backendUrl, dToken} = useContext(DoctorContext);

  const addNewRow = () => {
    setMedicines([...medicines, { name: "", dose: "", duration: "", remarks: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const savePrescription = async () => {
    setIsSaving(true);
    try {
      const {data} = await axios.post(
        backendUrl + "/api/doctor/create-prescription",
        {
          appointmentId,
          medicines,
        },
        {headers: {dToken}}
      );
      console.log(data);
      
      if (data.success) {
        setMedicines([
          { name: "", dose: "", duration: "", remarks: "" },
        ]);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        Prescription Writer
      </h2>
      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border text-left">Sl. No</th>
              <th className="p-3 border text-left">Medicine Name</th>
              <th className="p-3 border text-left">Dose</th>
              <th className="p-3 border text-left">Duration</th>
              <th className="p-3 border text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-3 border">
                  {index+1}
                </td>
                <td className="p-3 border">
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </td>
                <td className="p-3 border">
                  <input
                    type="text"
                    value={med.dose}
                    onChange={(e) => handleChange(index, "dose", e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </td>
                <td className="p-3 border">
                  <input
                    type="text"
                    value={med.duration}
                    onChange={(e) => handleChange(index, "duration", e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </td>
                <td className="p-3 border">
                  <input
                    type="text"
                    value={med.remarks}
                    onChange={(e) => handleChange(index, "remarks", e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={addNewRow}
          className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          Add Row
        </button>
        <button
          onClick={savePrescription}
          disabled={isSaving}
          className="py-2 px-4 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
        >
          {isSaving ? "Saving..." : "Save & Generate PDF"}
        </button>
      </div>
    </div>
  );
};

export default PrescriptionTable;