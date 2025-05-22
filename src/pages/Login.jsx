import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { AdminContext } from "../context/adminContext";
import { DoctorContext } from "../context/doctorContext";
import { AppContext } from "../context/appContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [loginState, setLoginState] = useState("Login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {Loader} = useContext(AppContext)
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const [isLoading, setIsLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true)
      if (state === "Admin") {
        try {
          if (loginState === "Login") {
            const { data } = await axios.post(backendUrl + "/api/admin/login", {
              email,
              password,
            });
            if (data.success) {
              localStorage.setItem("aToken", data.token);
              setAToken(data.token);
            } else {
              toast.error(data.message);
            }
          } else {
            const { data } = await axios.post(
              backendUrl + "/api/admin/register",
              { name, email, password }
            );
            if (data.success) {
              localStorage.setItem("aToken", data.token);
              setAToken(data.token);
            } else {
              toast.error(data.message);
            }
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <form className="min-h-[90vh] flex items-center" onSubmit={submitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 md:min-w-[384px] max-sm:min-w-[280px] border-zinc-50 rounded-xl text-[#5E5E5E] tet-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span>{" "}
          {loginState === "Register" ? "Register" : "Login"}
        </p>
        {loginState === "Register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="text"
              value={name}
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            value={password}
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer">
          {isLoading ? <Loader color="#ffffff" /> : loginState === "Register" ? "Register" : "Login"}
        </button>
        {loginState !== "Register" && (
          <p>
            Admin Register{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => {
                setState("Admin");
                setLoginState("Register");
              }}
            >
              Click here
            </span>
          </p>
        )}
        {state === "Admin" ? (
          <p>
            Doctor Login{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => {
                setState("Doctor");
                setLoginState("Login");
              }}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => {
                setState("Admin");
                setLoginState("Login");
              }}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
