import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/adminContext";
import { DoctorContext } from "../context/doctorContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    navigate("/");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
  };

  return (
    <>
      <header className="flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-300 bg-white">
        <div className="flex items-center text-xs gap-2">
          <img
            className="w-36 sm:w-40 cursor-pointer"
            src={assets.admin_logo}
            alt="Logo"
            onClick={() => navigate("/")}
          />
          <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
            {aToken ? "Admin" : "Doctor"}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={logout}
            className="bg-primary text-white text-sm px-10 py-2 rounded-full max-sm:hidden"
          >
            Logout
          </button>
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden">
            <Menu />
          </button>
        </div>
      </header>

      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700"
          >
            <X />
          </button>
        </div>

        <nav className="mt-5 text-[#515151]">
          {aToken && (
            <ul>
              <li>
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 cursor-pointer ${
                      isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
                    }`
                  }
                  to="/admin-dashboard"
                >
                  <img
                    src={assets.home_icon}
                    alt="Dashboard Icon"
                    className="max-sm:h-4 max-sm:w-4 flex-shrink-0"
                  />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 cursor-pointer ${
                      isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
                    }`
                  }
                  to="/all-appointments"
                >
                  <img
                    src={assets.appointment_icon}
                    alt="Appointments"
                    className="max-sm:h-4 max-sm:w-4 flex-shrink-0"
                  />
                  <span>Appointments</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 cursor-pointer ${
                      isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
                    }`
                  }
                  to="/add-doctor"
                >
                  <img
                    src={assets.add_icon}
                    alt="Add Doctor"
                    className="max-sm:h-4 max-sm:w-4 flex-shrink-0"
                  />
                  <span>Add Doctor</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 cursor-pointer ${
                      isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
                    }`
                  }
                  to="/doctor-list"
                >
                  <img
                    src={assets.people_icon}
                    alt="Doctors List"
                    className="max-sm:h-4 max-sm:w-4 flex-shrink-0"
                  />
                  <span>Doctors List</span>
                </NavLink>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="bg-primary text-white text-sm px-10 py-2 mt-2 rounded-full"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
          {dToken && (
            <ul>
              <li>
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 cursor-pointer ${
                      isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
                    }`
                  }
                  to="/doctor-dashboard"
                >
                  <img
                    src={assets.home_icon}
                    alt="Dashboard Icon"
                    className="max-sm:h-4 max-sm:w-4 flex-shrink-0"
                  />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 cursor-pointer ${
                      isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
                    }`
                  }
                  to="/doctor-appointments"
                >
                  <img
                    src={assets.appointment_icon}
                    alt="Appointments"
                    className="max-sm:h-4 max-sm:w-4 flex-shrink-0"
                  />
                  <span>Appointments</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 cursor-pointer ${
                      isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
                    }`
                  }
                  to="/add-blog"
                >
                  <img
                    width="25"
                    height="25"
                    src="https://img.icons8.com/ios/25/blog.png"
                    alt="Add Blog"
                    className="max-sm:h-4 max-sm:w-4 flex-shrink-0"
                  />
                  <span>Add Blog</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 cursor-pointer ${
                      isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
                    }`
                  }
                  to="/doctor-profile"
                >
                  <img
                    src={assets.people_icon}
                    alt="Profile"
                    className="max-sm:h-4 max-sm:w-4 flex-shrink-0"
                  />
                  <span>Profile</span>
                </NavLink>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="bg-primary text-white text-sm px-10 py-2 mt-2 rounded-full ml-2"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
