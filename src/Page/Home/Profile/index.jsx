// import React from "react";
// import "./profile.css";
// import AnimatedSVG from "./animited";
// const Index = () => {
//   return (
//     <div className="All-Conatinor-perfect-divv">
//       <div className="All-Containor-perfect-second-divv">
//         <div className="main_myprofile_div">
//           <AnimatedSVG />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;

import React, { useContext, useState, useEffect } from "react";
import "./profile.css";
import { useFormik } from "formik";
import axios from "../../../Common/Api/Api";
import { toast, Toaster } from "react-hot-toast";
import Loader from "../../../Common/loader/index";
import Backdrop from "@mui/material/Backdrop";
import { GlobalContext } from "../../../GlobalContext";
import defultimg from "../../../Assets/defultimg.png";
import {
  FiEdit3,
  FiMail,
  FiPhone,
  FiUser,
  FiCamera,
  FiSave,
  FiX,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const Profile = () => {
  const { profiledata, setprofileData } = useContext(GlobalContext);

  const initialValues = {
    Fristname: "",
    LastName: "",
  };

  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEditToggle = () => setEditMode(!editMode);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageURL = URL.createObjectURL(file);
      setPreviewImage(newImageURL);
      setImageFile(file);
    }
  };

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const getprofile = async () => {
    setLoading(true);
    try {
      const Response = await axios.get("/admin/get_profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });
      setLoading(false);
      setprofileData(Response?.data?.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getprofile();
  }, []);

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstname", values.Fristname);
      formData.append("lastname", values.LastName);
      if (imageFile) {
        formData.append("profile_pic", imageFile);
      }

      const response = await axios.put("/admin/update_profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${MyToken}`,
        },
      });

      resetForm();
      setEditMode(false);
      setLoading(false);
      getprofile();
      toast.success("Profile updated successfully!");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update profile");
      console.error("Error:", error);
    }
  };

  const {
    values,
    handleBlur,
    handleChange,
    touched,
    handleSubmit,
    errors,
    setValues,
  } = useFormik({
    initialValues: initialValues,
    onSubmit,
  });

  useEffect(() => {
    if (profiledata) {
      setValues({
        Fristname: profiledata.firstname || "",
        LastName: profiledata.lastname || "",
      });
      setPreviewImage(profiledata.profile_pic);
    }
  }, [profiledata, setValues]);

  return (
    <div className="All-Conatinor-perfect-divv">
      <div className="All-Containor-perfect-second-divv">
        <div className="main_myprofile_div">
          <div className="profile-wrapper">
            <div className="profile-content">
              {/* Header with Edit Button */}
              <div className="profile-header">
                <div className="header-decoration">
                  <HiOutlineSparkles className="sparkle-icon" />
                  <span className="header-text">My Profile</span>
                  <HiOutlineSparkles className="sparkle-icon" />
                </div>

                {!editMode && (
                  <button
                    className="edit-profile-btn"
                    onClick={handleEditToggle}
                  >
                    <FiEdit3 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Profile Section */}
              <div className="profile-main">
                {/* Profile Image */}
                <div className="profile-image-section">
                  <div className="profile-image-container">
                    {editMode ? (
                      <>
                        <input
                          type="file"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                          id="profile-image-input"
                          accept="image/*"
                        />
                        <label
                          htmlFor="profile-image-input"
                          className="image-upload-label"
                        >
                          <img
                            src={
                              previewImage ||
                              profiledata?.profile_pic ||
                              defultimg
                            }
                            alt="Profile"
                            className="profile-image"
                          />
                          <div className="image-overlay">
                            <FiCamera size={24} />
                            <span>Change Photo</span>
                          </div>
                        </label>
                      </>
                    ) : (
                      <img
                        src={profiledata?.profile_pic || defultimg}
                        alt="Profile"
                        className="profile-image"
                      />
                    )}
                    <div className="profile-status-indicator"></div>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="profile-info-section">
                  {editMode ? (
                    <form onSubmit={handleSubmit} className="profile-edit-form">
                      <div className="form-header">
                        <h2>Edit Profile Information</h2>
                        <p>Update your personal details below</p>
                      </div>

                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="Fristname">
                            <FiUser size={16} />
                            First Name
                          </label>
                          <input
                            type="text"
                            id="Fristname"
                            name="Fristname"
                            value={values.Fristname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your first name"
                            className="form-input"
                          />
                          {errors.Fristname && touched.Fristname && (
                            <span className="error-message">
                              {errors.Fristname}
                            </span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="LastName">
                            <FiUser size={16} />
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="LastName"
                            name="LastName"
                            value={values.LastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your last name"
                            className="form-input"
                          />
                          {errors.LastName && touched.LastName && (
                            <span className="error-message">
                              {errors.LastName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="cancel-btn"
                        >
                          <FiX size={18} />
                          Cancel
                        </button>
                        <button type="submit" className="save-btn">
                          <FiSave size={18} />
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="profile-display">
                      <div className="profile-greeting">
                        <h1>
                          Hello, I'm{" "}
                          <span className="name-highlight">
                            {`${profiledata?.firstname || ""} ${
                              profiledata?.lastname || ""
                            }`.trim() || "User"}
                          </span>
                        </h1>
                        <p className="profile-subtitle">
                          Welcome to your dashboard
                        </p>
                      </div>

                      <div className="profile-details">
                        <div className="detail-item">
                          <div className="detail-icon">
                            <FiMail size={20} />
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">Email Address</span>
                            <span className="detail-value">
                              {profiledata?.email || "Not provided"}
                            </span>
                          </div>
                        </div>

                        {profiledata?.phone && (
                          <div className="detail-item">
                            <div className="detail-icon">
                              <FiPhone size={20} />
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">Phone Number</span>
                              <span className="detail-value">
                                {profiledata.phone}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Animated Wave Background */}
              {/* <div className="wave-container">
                <svg
                  className="waves"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 24 150 28"
                  preserveAspectRatio="none"
                  shapeRendering="auto"
                >
                  <defs>
                    <path
                      id="gentle-wave"
                      d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                    />
                  </defs>
                  <g className="parallax">
                    <use
                      xlinkHref="#gentle-wave"
                      x="48"
                      y="0"
                      fill="var(--primary-color-lightgreen)"
                      fillOpacity="0.7"
                    />
                    <use
                      xlinkHref="#gentle-wave"
                      x="48"
                      y="3"
                      fill="var(--primary-color-lightgreen)"
                      fillOpacity="0.5"
                    />
                    <use
                      xlinkHref="#gentle-wave"
                      x="48"
                      y="5"
                      fill="var(--primary-color-lightgreen)"
                      fillOpacity="0.3"
                    />
                    <use
                      xlinkHref="#gentle-wave"
                      x="48"
                      y="7"
                      fill="var(--primary-color-lightgreen)"
                      fillOpacity="0.1"
                    />
                  </g>
                </svg>
              </div> */}
            </div>

            {/* Loading Backdrop */}
            {loading && (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  backgroundColor: "#004e61ad",
                }}
                open={true}
              >
                <Loader />
              </Backdrop>
            )}

            <Toaster position="top-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
