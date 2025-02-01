import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [step, setStep] = useState(1); // Step tracking
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    location: "",
    profilePicture: null, // Store file here
    bio: "",
    hobbies: "",
    profession: "",
  });

  const [preview, setPreview] = useState(null); // For profile picture preview

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change (for profile picture)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });

    // Create a preview of the selected file
    const fileReader = new FileReader();
    fileReader.onloadend = () => setPreview(fileReader.result);
    if (file) fileReader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append form data
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await axios.post("http://localhost:5000/api/auth/signup", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("User created successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {step === 1 && (
            <>
              {/* Step 1: Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <button
                type="button"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Step 2: Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Profile Picture Upload */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <div className="flex items-center space-x-4">
                  {/* Profile Picture Preview */}
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all duration-300">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">📷</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-all duration-300">
                    <span className="mr-2">Choose File</span>
                    <input
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Helper Text */}
                <p className="mt-2 text-sm text-gray-500">
                  Upload a profile picture (JPEG, PNG, or GIF).
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hobbies (comma separated)</label>
                <input
                  type="text"
                  name="hobbies"
                  placeholder="e.g., Reading, Coding, Traveling"
                  value={formData.hobbies}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Profession</label>
                <input
                  type="text"
                  name="profession"
                  placeholder="Your profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;