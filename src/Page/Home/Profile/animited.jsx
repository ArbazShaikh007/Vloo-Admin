import React, { useContext, useState, useEffect } from "react";
import profile_img from "../../../Assets/userlist/Ben.jpg";
import { useFormik } from "formik";
import { MDBInput } from "mdb-react-ui-kit";
import { EditprofileSchemas } from "../../../schemas/index";
// import PhoneInput from "react-phone-number-input";
import axios from "../../../Common/Api/Api";
import { toast, Toaster } from "react-hot-toast";
import Loader from "../../../Common/loader/index";
import Backdrop from "@mui/material/Backdrop";
import { GlobalContext } from "../../../GlobalContext";
import defultimg from "../../../Assets/defultimg.png";
import "./profile.css";

const AnimatedSVG = () => {
  const [value, setValue] = useState();
  const [userData, setUserData] = useState({
    image: profile_img,
    name: "Joe",
    email: "joe@example.com",
    mobileNumber: "123-456-7890",
  });
  const { profiledata, setprofileData } = useContext(GlobalContext);
  console.log("🚀 ~ AnimatedSVG ~ profiledata:", profiledata);

  const initialValues = {
    Fristname: "",
    LastName: "",
  };

  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleEditToggle = () => setEditMode(!editMode);
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageURL = URL.createObjectURL(file);
      setPreviewImage(newImageURL);
      setImageFile(file);
    }
  };

  const editicon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_10_151)">
        <path
          d="M6.414 16L16.556 5.858L15.142 4.444L5 14.586V16H6.414ZM7.243 18H3V13.757L14.435 2.322C14.6225 2.13453 14.8768 2.02921 15.142 2.02921C15.4072 2.02921 15.6615 2.13453 15.849 2.322L18.678 5.151C18.8655 5.33853 18.9708 5.59284 18.9708 5.858C18.9708 6.12316 18.8655 6.37747 18.678 6.565L7.243 18ZM3 20H21V22H3V20Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_10_151">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const mobile = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 3.538C10.475 3.538 8.428 3.706 6.995 3.845C6.70773 3.87185 6.43924 3.99957 6.23715 4.2055C6.03507 4.41143 5.91243 4.68227 5.891 4.97C5.75 6.818 5.548 9.813 5.548 12C5.548 14.187 5.749 17.183 5.891 19.03C5.937 19.627 6.401 20.098 6.995 20.155C8.428 20.295 10.475 20.461 12 20.461C13.525 20.461 15.572 20.294 17.005 20.155C17.2923 20.1282 17.5608 20.0004 17.7628 19.7945C17.9649 19.5886 18.0876 19.3177 18.109 19.03C18.251 17.182 18.452 14.187 18.452 12C18.452 9.813 18.251 6.818 18.109 4.97C18.0876 4.68227 17.9649 4.41143 17.7628 4.2055C17.5608 3.99957 17.2923 3.87185 17.005 3.845C15.573 3.705 13.525 3.538 12 3.538ZM6.845 2.314C8.281 2.174 10.394 2 12 2C13.606 2 15.72 2.174 17.155 2.314C17.8037 2.37494 18.41 2.66298 18.867 3.12732C19.324 3.59165 19.6024 4.20246 19.653 4.852C19.794 6.701 20 9.748 20 12C20 14.252 19.795 17.3 19.653 19.148C19.6026 19.7977 19.3243 20.4088 18.8673 20.8733C18.4102 21.3378 17.8038 21.626 17.155 21.687C15.719 21.826 13.606 22 12 22C10.394 22 8.28 21.826 6.845 21.687C6.19613 21.626 5.58971 21.3376 5.13281 20.8728C4.67592 20.4081 4.39795 19.7968 4.348 19.147C4.205 17.3 4 14.253 4 12C4 9.748 4.205 6.7 4.348 4.852C4.3986 4.20261 4.67683 3.59193 5.13364 3.12762C5.59045 2.6633 6.19652 2.37517 6.845 2.314Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.194 17.128C10.194 16.703 10.54 16.359 10.968 16.359H13.032C13.46 16.359 13.807 16.703 13.807 17.129C13.807 17.555 13.46 17.897 13.032 17.897H10.968C10.7634 17.8975 10.567 17.8168 10.4219 17.6727C10.2768 17.5285 10.1948 17.3326 10.194 17.128Z"
        fill="white"
      />
      <path
        d="M13.032 6.872C13.032 7.438 12.57 7.897 12 7.897C11.43 7.897 10.968 7.438 10.968 6.872C10.968 6.305 11.43 5.846 12 5.846C12.57 5.846 13.032 6.306 13.032 6.872Z"
        fill="white"
      />
    </svg>
  );

  const mail = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_10_201)">
        <path
          d="M3 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3ZM20 7.238L12.072 14.338L4 7.216V19H20V7.238ZM4.511 5L12.061 11.662L19.502 5H4.511Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_10_201">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  console.log("🚀 ~ AnimatedSVG ~ MyToken:", MyToken);
  const adminDATA = JSON.parse(localStorage.getItem("responseData"));
  const [loading, setloading] = useState(false);

  const getprofile = async () => {
    setloading(true);
    try {
      const Response = await axios.get("/admin/get_profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      setloading(false);
      setprofileData(Response?.data?.data);
    } catch (error) {
      setloading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getprofile();
  }, []);

  const onSubmit = async (values, { resetForm }) => {
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("firstname", values.Fristname);
      formData.append("lastname", values.LastName);

      formData.append("profile_pic", imageFile);
      const response = await axios.put("/admin/update_profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${MyToken}`,
        },
      });
      console.log("🚀 ~ onSubmit ~ response:", response);
      resetForm();
      setValue();
      setEditMode(false);
      setloading(false);
      getprofile();
    } catch (error) {
      setloading(false);
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
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: EditprofileSchemas,
    onSubmit,
  });
  useEffect(() => {
    if (profiledata) {
      setValues({
        Fristname: profiledata.firstname,
        LastName: profiledata.lastname,
      });
      setPreviewImage(profiledata.profile_pic);
    }
  }, [profiledata]);

  return (
    <div className="main_edit_profile_div">
      <div className="btn_of_edit">
        {editMode ? null : (
          <button className="theered_btn" onClick={handleEditToggle}>
            Edit
          </button>
        )}
      </div>

      <section className="banner">
        <div className="profile_img_div">
          {editMode ? (
            <>
              <input
                className="profile_pic"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="file-input"
              />
              <label htmlFor="file-input" className="custom-file-upload">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="profile_pic"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <img
                    src={defultimg}
                    alt="image"
                    className="profile_pic"
                    style={{ width: "100%" }}
                  />
                )}
                <span className="editicon_">{editicon}</span>
              </label>
            </>
          ) : (
            <img
              src={
                profiledata?.profile_pic ? profiledata?.profile_pic : defultimg
              }
              alt="Profile"
              className="profile_pic"
            />
          )}
        </div>
        <div className="banner-content">
          {editMode ? (
            <div className="edit_profile_from_box">
              <form action="" onSubmit={handleSubmit}>
                <div className="fname">
                  <label htmlFor="text"> First Name</label>
                  <div className="fname_input">
                    <input
                      type="text"
                      id="Fristname"
                      name="Fristname"
                      value={values.Fristname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="First Name"
                    />
                  </div>
                  {errors.Fristname && touched.Fristname ? (
                    <p className="errors_msg_p_e">{errors.Fristname} </p>
                  ) : null}
                </div>
                <div className="email_div">
                  <label htmlFor="text">LastName</label>
                  <div className="email_input">
                    <input
                      type="text"
                      id="LastName"
                      name="LastName"
                      value={values.LastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Last Name"
                    />
                  </div>
                  {errors.LastName && touched.LastName ? (
                    <p
                      className="errors_msg_p_e
"
                    >
                      {errors.LastName}{" "}
                    </p>
                  ) : null}
                </div>

                <button className="theered_btn" type="submit">
                  Submit
                </button>
              </form>
            </div>
          ) : (
            <div className="profile_show_data">
              <h2>
                Hello, I'm{" "}
                {`${profiledata?.firstname} ${profiledata?.lastname}`}
              </h2>
              <p>
                {mail} :- {profiledata?.email}
              </p>
              {/* <p>
                {mobile} :- {profiledata?.mobileNumber}
              </p> */}
            </div>
          )}
        </div>
      </section>
      <svg
        className="svg-container"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0
        58-18 88-18s
        58 18 88 18
        58-18 88-18
        58 18 88 18
        v44h-352z"
          />
        </defs>
        <g className="waves">
          <use
            xlinkHref="#gentle-wave"
            x="50"
            y="0"
            fill=" var(--primary-color-lightgreen)"
            fillOpacity=".2"
          />
          <use
            xlinkHref="#gentle-wave"
            x="50"
            y="3"
            fill=" var(--primary-color-lightgreen)"
            fillOpacity=".5"
          />
          <use
            xlinkHref="#gentle-wave"
            x="50"
            y="6"
            fill=" var(--primary-color-lightgreen)"
            fillOpacity=".9"
          />
        </g>
      </svg>
      {!loading && <div></div>}
      {loading && (
        <div>
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
        </div>
      )}
    </div>
  );
};

export default AnimatedSVG;
