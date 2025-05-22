import React, { useContext, useState, useEffect } from "react";
import { DoctorContext } from "../../context/doctorContext";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
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
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="m-5">
        <div className="flex flex-col gap-4">
          <div className="flex-shrink-0">
            <img
              className="bg-primary/80 w-full md:w-auto md:max-w-[300px] rounded-lg object-cover"
              src={profileData.image}
              alt={profileData.name}
            />
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-4 md:p-8 bg-white">
            <p className="flex items-center gap-2 text-2xl md:text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p className="text-sm md:text-base">
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border border-primary text-xs rounded-full">
                {profileData.experience}
              </button>
            </div>
            <div className="mt-3">
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800">
                About:
              </p>
              <p className="text-sm text-gray-600 max-w-full md:max-w-[700px] mt-1">
                {profileData.about}
              </p>
            </div>
            <p className="text-gray-600 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800">
                {currency}{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                    className="border rounded px-2 py-1 w-24 text-sm"
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>

            <div className="flex flex-col md:flex-row gap-2 py-2">
              <div>
                <p className="text-sm font-medium">Address:</p>
                {isEdit ? (
                  <>
                    <input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                      value={profileData.address.line1}
                      className="border rounded px-2 py-1 w-full md:w-auto text-sm mb-1"
                      placeholder="Line 1"
                    />
                    <input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                      value={profileData.address.line2}
                      className="border rounded px-2 py-1 w-full md:w-auto text-sm"
                      placeholder="Line 2"
                    />
                  </>
                ) : (
                  <p className="text-sm">
                    {profileData.address.line1}
                    <br />
                    {profileData.address.line2}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 pt-2">
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
                className="w-4 h-4"
              />
              <label className="text-sm">Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;