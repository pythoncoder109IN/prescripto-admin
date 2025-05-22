import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/adminContext";
import { toast } from 'react-toastify'
import axios from "axios"
import { AppContext } from "../../context/appContext";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [isloading, setIsLoading] = useState(false)

  const {aToken, backendUrl} = useContext(AdminContext)
  const {Loader} = useContext(AppContext)

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      if (!docImg) {
        return toast.error('Image not selected')
      }

      const formData = new FormData()
      formData.append('adminId', '')
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', fees)
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({line1: address1, line2: address2}))

      const {data} = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {headers: {aToken}})
      
      if (data.success) {
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setExperience('1 Year')
        setFees('')
        setAbout('')
        setSpeciality('General physician')
        setDegree('')
        setAddress1('')
        setAddress2('')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <form className="m-5 w-full" onSubmit={submitHandler}>
  <p className="mb-3 text-lg font-medium max-sm:text-center">Add Doctor</p>

  <div className="bg-white px-4 py-8 border border-gray-300 rounded w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-md">
    {/* Upload Doctor Picture Section */}
    <div className="flex items-center gap-4 mb-8 text-gray-500">
      <label htmlFor="doc-img">
        <img
          className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full cursor-pointer object-cover"
          src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
          alt="Doctor upload"
        />
      </label>
      <input
        onChange={(e) => setDocImg(e.target.files[0])}
        type="file"
        id="doc-img"
        hidden
      />
      <p className="text-sm">
        Upload doctor <br /> picture
      </p>
    </div>

    {/* Form Fields Section */}
    <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
      {/* Left Column */}
      <div className="w-full lg:flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm">Doctor name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="border rounded px-3 py-2 w-full"
            type="text"
            placeholder="Name"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Doctor email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border rounded px-3 py-2 w-full"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Doctor password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border rounded px-3 py-2 w-full"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Experience</p>
          <select
            onChange={(e) => setExperience(e.target.value)}
            value={experience}
            className="border rounded px-3 py-2 w-full"
            id="year"
          >
            <option value="1 Year">1 Year</option>
            <option value="2 Years">2 Years</option>
            <option value="3 Years">3 Years</option>
            <option value="4 Years">4 Years</option>
            <option value="5 Years">5 Years</option>
            <option value="6 Years">6 Years</option>
            <option value="7 Years">7 Years</option>
            <option value="8 Years">8 Years</option>
            <option value="9 Years">9 Years</option>
            <option value="10 Years">10 Years</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Fees</p>
          <input
            onChange={(e) => setFees(e.target.value)}
            value={fees}
            className="border rounded px-3 py-2 w-full"
            type="number"
            placeholder="Fees"
            required
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm">Speciality</p>
          <select
            onChange={(e) => setSpeciality(e.target.value)}
            value={speciality}
            className="border rounded px-3 py-2 w-full"
            id="speciality"
          >
            <option value="General physician">General physician</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatricians">Pediatricians</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Education</p>
          <input
            onChange={(e) => setDegree(e.target.value)}
            value={degree}
            className="border rounded px-3 py-2 w-full"
            type="text"
            placeholder="Education"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Address</p>
          <input
            onChange={(e) => setAddress1(e.target.value)}
            value={address1}
            className="border rounded px-3 py-2 w-full"
            type="text"
            placeholder="Line 1"
            required
          />
          <input
            onChange={(e) => setAddress2(e.target.value)}
            value={address2}
            className="border rounded px-3 py-2 w-full"
            type="text"
            placeholder="Line 2"
            required
          />
        </div>
      </div>
    </div>

    {/* About Doctor Section */}
    <div className="mt-4">
      <p className="mb-2 text-sm">About Doctor</p>
      <textarea
        onChange={(e) => setAbout(e.target.value)}
        value={about}
        className="w-full px-4 pt-2 border rounded resize-y"
        placeholder="Write about doctor"
        rows={5}
        required
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="bg-primary px-10 py-3 mt-5 text-white rounded-full w-full flex justify-center items-center"
    >
      {isloading ? <Loader color="#ffffff" /> : "Add doctor"}
    </button>
  </div>
</form>
  );
};

export default AddDoctor;
