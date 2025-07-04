import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { AdminContext } from "../context/adminContext";
import { DoctorContext } from "../context/doctorContext";
import { AppContext } from "../context/appContext";
import { 
  Shield, 
  Stethoscope, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Sparkles,
  Heart
} from "lucide-react";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [loginState, setLoginState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { Loader } = useContext(AppContext);
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
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
              toast.success("Welcome back, Admin! 🎉", {
                style: {
                  borderRadius: "12px",
                  background: "#10b981",
                  color: "#fff",
                },
              });
            } else {
              toast.error(data.message, {
                style: {
                  borderRadius: "12px",
                  background: "#ef4444",
                  color: "#fff",
                },
              });
            }
          } else {
            const { data } = await axios.post(
              backendUrl + "/api/admin/register",
              { name, email, password }
            );
            if (data.success) {
              localStorage.setItem("aToken", data.token);
              setAToken(data.token);
              toast.success("Admin account created successfully! 🚀", {
                style: {
                  borderRadius: "12px",
                  background: "#10b981",
                  color: "#fff",
                },
              });
            } else {
              toast.error(data.message, {
                style: {
                  borderRadius: "12px",
                  background: "#ef4444",
                  color: "#fff",
                },
              });
            }
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message, {
            style: {
              borderRadius: "12px",
              background: "#ef4444",
              color: "#fff",
            },
          });
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Welcome back, Doctor! 👨‍⚕️", {
            style: {
              borderRadius: "12px",
              background: "#10b981",
              color: "#fff",
            },
          });
        } else {
          toast.error(data.message, {
            style: {
              borderRadius: "12px",
              background: "#ef4444",
              color: "#fff",
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        style: {
          borderRadius: "12px",
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20"
        />
        <motion.div
          animate={{ 
            y: [-20, 20, -20]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-20"
        />
      </div>

      <motion.form 
        className="relative z-10 w-full max-w-md"
        onSubmit={submitHandler}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center space-y-4"
            variants={itemVariants}
          >
            <motion.div 
              className="flex justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                {state === "Admin" ? (
                  <Shield className="text-white" size={32} />
                ) : (
                  <Stethoscope className="text-white" size={32} />
                )}
              </div>
            </motion.div>
            
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {state} {loginState}
              </h1>
              <p className="text-gray-600 mt-2">
                {loginState === "Login" ? "Welcome back!" : "Create your account"}
              </p>
            </div>

            {/* State Toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <motion.button
                type="button"
                onClick={() => setState("Admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  state === "Admin"
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield size={16} />
                Admin
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setState("Doctor")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  state === "Doctor"
                    ? "bg-white text-purple-600 shadow-lg"
                    : "text-gray-600 hover:text-purple-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Stethoscope size={16} />
                Doctor
              </motion.button>
            </div>
          </motion.div>

          {/* Form Fields */}
          <div className="space-y-5">
            <AnimatePresence>
              {loginState === "Register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  variants={itemVariants}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <motion.input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your full name"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <motion.input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <Loader color="#ffffff" />
            ) : (
              <>
                <Sparkles size={20} />
                {loginState === "Register" ? "Create Account" : "Sign In"}
              </>
            )}
          </motion.button>

          {/* Footer Links */}
          <motion.div 
            className="space-y-3 text-center"
            variants={itemVariants}
          >
            {loginState !== "Register" && state === "Admin" && (
              <motion.p 
                className="text-sm text-gray-600"
                whileHover={{ scale: 1.05 }}
              >
                New admin?{" "}
                <button
                  type="button"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                  onClick={() => {
                    setState("Admin");
                    setLoginState("Register");
                  }}
                >
                  Create account
                </button>
              </motion.p>
            )}

          </motion.div>

        </motion.div>
      </motion.form>
    </div>
  );
};

export default Login;