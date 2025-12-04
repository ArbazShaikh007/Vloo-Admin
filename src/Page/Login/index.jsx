import React, { useState, useContext } from "react";
import "./Login.css";
import logo from "../../Assets/Logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import { LoginSchemas } from "../../schemas/index";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import { GlobalContext } from "../../GlobalContext";
import CircularProgress from "@mui/material/CircularProgress";
import Loader from "../../Common/loader/index";
import { toast, Toaster } from "react-hot-toast";
import axios from "../../Common/Api/Api";
import CanvasBackground from "../../Common/CanvasBackground";

const initialValues = {
  Email: "",
  Password: "",
};

const Index = () => {
  const {
    forgotPasswordModel,
    setForgotPasswordModel,
    setIsSubadmin,
    setprofileData,
  } = useContext(GlobalContext);

  const [loading, setloading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown((passwordShown) => !passwordShown);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (values) => {
    setloading(true);
    try {
      const response = await axios.post(
        "admin/login",
        {
          email: values.Email,
          password: values.Password,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      console.log("check success response ===>", response);

      if (response?.data?.status === 1) {
        const user = response?.data?.data;

        if (setprofileData) {
          setprofileData(user);
        }

        if (
          user?.is_subadmin === true ||
          user?.is_subadmin === 1 ||
          user?.is_subadmin === "1"
        ) {
          console.log("🟢 setting subadmin TRUE from login");
          setIsSubadmin && setIsSubadmin(true);
        } else {
          console.log("🔵 setting subadmin FALSE from login");
          setIsSubadmin && setIsSubadmin(false);
        }

        // toast.dismiss();
        const toastId = toast.success(response?.data?.message, {
          position: "top-right",
          duration: 3000,
          style: { background: "#333", color: "#fff" },
        });
        setTimeout(() => {
          toast.dismiss(toastId);
        }, 1000);

        navigate("/Home");

        localStorage.setItem(
          "Login Response",
          JSON.stringify(response?.data?.data)
        );
        localStorage.setItem(
          "MYtokan",
          JSON.stringify(response?.data?.data?.token)
        );
      } else {
        toast.dismiss();
        toast.error(response?.data?.message, {
          position: "top-right",
          duration: 3000,
        });
      }

      setloading(false);
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        duration: 3000,
        style: { background: "#333", color: "#fff" },
      });

      setloading(false);
      console.log("check error ===>", error);
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
  } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchemas,
    onSubmit,
  });

  const [selectedAdmin, setSelectedAdmin] = useState("");

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setFieldValue("Admin", value);
  };

  return (
    <>
      <Toaster />
      <div className="main_div">
        <CanvasBackground />

        <div className="sub_main_div">
          <div className="login_card">
            <div className="logo_box">
              <img src={logo} alt="" />
            </div>
            <div className="text_div">
              <h1>Welcome</h1>
              <h4>Please Login to Admin Dashboard</h4>
            </div>
            <div className="form_div">
              <form onSubmit={handleSubmit}>
                <div className="Email_box">
                  <label htmlFor="email">Email</label>
                  <div className="input_div">
                    <input
                      type="email"
                      id="email"
                      name="Email"
                      value={values.Email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.Email && touched.Email ? (
                    <p className="errors_msg_p">{errors.Email} </p>
                  ) : null}
                </div>
                <div className="Email_box">
                  <label htmlFor="email">Password</label>
                  <div className="input_div_pass">
                    <input
                      type={passwordShown ? "text" : "password"}
                      id="Password"
                      name="Password"
                      value={values.Password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <i
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    >
                      <FontAwesomeIcon
                        icon={passwordShown ? faEyeSlash : faEye}
                        style={{ color: "white" }}
                      />
                    </i>
                  </div>
                  {errors.Password && touched.Password ? (
                    <p className="errors_msg_p">{errors.Password} </p>
                  ) : null}
                </div>

                <div className="Forgot_text">
                  <p onClick={() => setForgotPasswordModel(true)}>
                    Forgotten Your password ?
                  </p>
                </div>
                <button
                  type="submit"
                  className="btn_primry"
                  style={{ textAlign: "center" }}
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
};

export default Index;
