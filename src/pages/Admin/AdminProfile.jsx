import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/adminContext";
import { AppContext } from "../../context/appContext";
import { DoctorContext } from "../../context/doctorContext";

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
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (aToken) {
      getProfileData();
    }
  }, [aToken]);

  return aToken && profileData ? (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-4">
        <div className="border border-stone-100 rounded-lg bg-white p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:gap-2 mt-1 text-gray-600">
            {isEdit ? (
              <input
                className="bg-gray-50 text-xl md:text-3xl font-medium w-full md:max-w-md"
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <p className="font-medium text-xl md:text-3xl text-neutral-800">
                Welcome, {profileData.name}
              </p>
            )}
            <button className="mt-2 hidden md:block py-0.5 px-2 border text-xs rounded-full">
              Admin
            </button>
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Email: <span className="text-gray-800">{profileData.email}</span>
          </p>

          {isEdit && (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 py-2">
              <p>Update Password:</p>
              <input
                type="text"
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                value={profileData.password}
                className="bg-gray-50 p-2 border rounded w-full md:w-auto"
              />
            </div>
          )}

          <div className="mt-5 flex flex-col md:flex-row gap-2">
            {isEdit && (
              <button
                className="border border-red-500 px-4 py-2 rounded-full hover:bg-red-400 hover:text-white transition-all"
                onClick={cancelUpdateProfile}
              >
                Cancel
              </button>
            )}
            {isEdit ? (
              <button
                className="border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                onClick={updateProfile}
              >
                {isLoading ? <Loader color="#ffffff" /> : "Save Information"}
              </button>
            ) : (
              <button
                className="border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-4">
        <div className="border border-stone-100 rounded-lg bg-white p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1 text-gray-600">
            <p className="font-medium text-xl md:text-3xl text-neutral-800">
              Welcome, {docData.name}
            </p>
            <button className="mt-2 hidden md:block md:mt-0 py-0.5 px-2 border text-xs rounded-full">
              Doctor
            </button>
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Email: <span className="text-gray-800">{docData.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;