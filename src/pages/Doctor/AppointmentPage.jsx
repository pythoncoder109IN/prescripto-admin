import axios from "axios";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { assets } from "../../assets/assets";
import { AppContext } from "../../context/appContext";
import { DoctorContext } from "../../context/doctorContext";
import PrescriptionTable from "../../components/PrescriptionTable";

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

  if (!appointmentData) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-12 animate-fadeIn">
  <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="p-6 max-sm:p-3 border-b border-gray-200">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        Appointment Details
      </h2>
      <div className="flex flex-wrap gap-4 items-center">
        <p className="mb-2 font-bold text-gray-700">Actions :</p>
        {appointmentData.cancelled ? (
          <p className="text-red-400 text-xs md:text-sm font-medium">Cancelled</p>
        ) : appointmentData.isCompleted ? (
          <p className="text-green-500 text-xs md:text-sm font-medium">Completed</p>
        ) : (
          <div className="flex gap-4">
            <img
              onClick={() => completeAppointment(appointmentData._id)}
              className="w-10 cursor-pointer"
              src={assets.tick_icon}
              alt="Complete Appointment"
            />
            <img
              onClick={() => cancelAppointment(appointmentData._id)}
              className="w-10 cursor-pointer"
              src={assets.cancel_icon}
              alt="Cancel Appointment"
            />
            <img
              onClick={() => joinMeeting(appointmentData._id)}
              className="w-10 cursor-pointer"
              src={assets.video_icon}
              alt="Join Meeting"
            />
          </div>
        )}
      </div>

      {/* Main content: User Details and Appointment Info */}
      <div className="flex flex-col md:flex-row gap-4 my-5">
        {/* User Details Card */}
        <div className="flex-1 border border-gray-300 p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
          <img
            src={appointmentData.userData.image}
            alt={appointmentData.userData.name}
            className="w-20 h-20 rounded-full mb-4 object-cover"
          />
          <p className="mb-2">
            <span className="font-bold">Name:</span> {appointmentData.userData.name}
          </p>
          <p className="mb-2">
            <span className="font-bold">Email:</span> {appointmentData.userData.email}
          </p>
          <p className="mb-2">
            <span className="font-bold">Phone:</span> {appointmentData.userData.phone}
          </p>
          <p className="mb-2">
            <span className="font-bold">Gender:</span> {appointmentData.userData.gender}
          </p>
          <p className="mb-2">
            <span className="font-bold">DOB:</span> {appointmentData.userData.dob}
          </p>
          <p className="mb-2">
            <span className="font-bold">Address:</span> {appointmentData.userData.address.line1},{" "}
            {appointmentData.userData.address.line2}
          </p>
        </div>

        {/* Appointment Details and Uploaded Documents */}
        <div className="flex-1 border border-gray-300 p-4 rounded-md shadow-sm">
          <p className="mb-2 text-gray-700">
            <span className="font-bold">Date:</span>{" "}
            {slotDateFormat(appointmentData.slotDate)} | {appointmentData.slotTime}
          </p>
          <p className="mb-2 text-gray-700">
            <span className="font-bold">Payment Status:</span>{" "}
            {appointmentData.payment ? "Paid" : "Not Paid"}
          </p>

          <div>
            {/* Uploaded Documents */}
            <div className="flex flex-col space-y-2 border-t-2 border-gray-400 mt-5 pt-5">
              <h3 className="text-xl font-semibold text-gray-800">Uploaded Documents</h3>
              <div className="flex h-48 w-full md:max-w-[40vw] overflow-x-scroll gap-3">
                {otherUploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-md p-3 shadow-md hover:shadow-xl flex flex-col justify-evenly my-5 min-w-[150px]"
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2 truncate">
                      {file.name.split("/")[1]}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(file.url, "_blank")}
                        className="flex-1 py-1 px-3 text-sm font-semibold text-gray-800 bg-yellow-400 rounded-md shadow-sm transition hover:bg-yellow-500"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescription Documents */}
            {prescriptionFiles.length > 0 && (
              <div className="flex flex-col space-y-2 border-t-2 border-gray-400 mt-5 pt-5">
                <h3 className="text-xl font-semibold text-gray-800">Prescription</h3>
                <div className="flex h-48 w-full md:max-w-[40vw] overflow-x-scroll gap-3">
                  {prescriptionFiles.map((file, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-md p-3 shadow-md hover:shadow-xl flex flex-col justify-evenly my-5 min-w-[150px]"
                    >
                      <p className="text-sm font-medium text-gray-700 mb-2 truncate">
                        {file.name.split("/")[1] || file.name}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(file.url, "_blank")}
                          className="flex-1 py-1 px-3 text-sm font-semibold text-gray-800 bg-yellow-400 rounded-md shadow-sm transition hover:bg-yellow-500"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Prescription Table Section (conditionally rendered) */}
    {!appointmentData.isCompleted && !appointmentData.cancelled && (
      <div className="p-6">
        <PrescriptionTable appointmentId={appointmentId} />
      </div>
    )}
  </div>
</div>
  );
};

export default AppointmentPage;
