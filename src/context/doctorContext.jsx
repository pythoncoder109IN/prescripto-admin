import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { AppContext } from "./appContext";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [meetingData, setMeetingData] = useState({});
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/appointments",
        {},
        { headers: { dToken } }
      );

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/dashboard",
        {},
        { headers: { dToken } }
      );

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/profile",
        {},
        { headers: { dToken } }
      );

      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const joinMeeting = async (appointmentId) => {
    const apiKey = import.meta.env.VITE_STREAM_API_KEY;
    const userId = profileData._id;
    const callId = appointmentId;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/token",
        { id: userId },
        { headers: { dToken } }
      );

      const userToken = data.token;

      const user = {
        id: userId,
        name: profileData.name,
        image: profileData.image,
      };

      if (!userToken) {
        setIsLoading(true);
      }

      const client = StreamVideoClient.getOrCreateInstance({
        apiKey,
        user,
        token: userToken,
      });
      const call = client.call("default", callId);
      call.join({ create: true });
      setMeetingData({ call, client, appointmentId });
      navigate("/meeting");
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Clear all data when token is removed
  const clearDoctorData = () => {
    setAppointments([]);
    setMeetingData({});
    setDashData(false);
    setProfileData(false);
    setIsLoading(false);
  };

  // Enhanced setDToken to clear data when token is removed
  const setDTokenWithCleanup = (token) => {
    setDToken(token);
    if (!token) {
      clearDoctorData();
    }
  };

  const value = {
    dToken,
    setDToken: setDTokenWithCleanup,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    joinMeeting,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    isLoading,
    setIsLoading,
    meetingData,
    setMeetingData,
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;