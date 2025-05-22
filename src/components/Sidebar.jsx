import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/adminContext";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/doctorContext";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return (
    <div className="min-h-screen bg-white border-r-gray-500 max-sm:hidden">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ' '}`} to={"/admin-dashboard"}>
            <img src={assets.home_icon} alt="Dashboard Icon" className="max-sm:h-4 max-sm:w-4 flex-shrink-0"/>
            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ' '}`} to={"/all-appointments"}>
            <img src={assets.appointment_icon} alt="" className="max-sm:h-4 max-sm:w-4 flex-shrink-0"/>
            <p className="hidden md:block">Appointments</p>
          </NavLink>
          <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ' '}`} to={"/add-doctor"}>
            <img src={assets.add_icon} alt="" className="max-sm:h-4 max-sm:w-4 flex-shrink-0" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>
          <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ' '}`} to={"/doctor-list"}>
            <img src={assets.people_icon} alt="" className="max-sm:h-4 max-sm:w-4 flex-shrink-0" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ' '}`} to={"/doctor-dashboard"}>
            <img src={assets.home_icon} alt="" className="max-sm:h-4 max-sm:w-4 flex-shrink-0" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ' '}`} to={"/doctor-appointments"}>
            <img src={assets.appointment_icon} alt="" className="max-sm:h-4 max-sm:w-4 flex-shrink-0" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>
          <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ' '}`} to={"/add-blog"}>
            <img width="25" height="25" src="https://img.icons8.com/ios/25/blog.png" alt="blog" className="max-sm:h-4 max-sm:w-4 flex-shrink-0"/>
            <p className="hidden md:block">Add Blog</p>
          </NavLink>
          <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ' '}`} to={"/doctor-profile"}>
            <img src={assets.people_icon} alt="" className="max-sm:h-4 max-sm:w-4 flex-shrink-0" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
