import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Model.css";

import {
  ForgotSchemas,
  ChnagepasswordSchemas,
  UpdatepasswordSchemas,
} from "../../schemas/index";
import axios from "../../Common/Api/Api";
import Loader from "../../Common/loader/index";
import { useFormik } from "formik";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import Backdrop from "@mui/material/Backdrop";
export const ForgotPasswordModel = () => {
  const {
    forgotPasswordModel,
    setForgotPasswordModel,
    setOtpverifyModel,
    mailOTP,
    setmailOTP,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setForgotPasswordModel(false);
  };

  const initialValues = {
    Email: "",
  };
  const [loading, setloading] = useState(false);
  const onSubmit = async (values, { resetForm }) => {
    setloading(true);
    try {
      const response = await axios.post(
        "/admin/forget_password",
        {
          email: values.Email,
        },
        {
          headers: {
            "content-type": "application/json",
            language: "fr",
          },
        }
      );

      toast.success(response.data.message, {
        position: "top-right",
      });

      handleClose();
      setmailOTP(values.Email);
      setOtpverifyModel(true);
      setloading(false);
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: "top-right",
      });
      console.log("Forgot password error:", error);
      setloading(false);
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
    validationSchema: ForgotSchemas,
    onSubmit,
    // onSubmit: (values, { resetForm }) => {
    //   console.log(values);
    //   resetForm();
    //   handleClose();
    //   setmailOTP(values.Email);
    //   setOtpverifyModel(true);
    // },
  });
  return (
    <>
      <Modal
        size="ms"
        show={forgotPasswordModel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "rgba(159, 160, 163, 0.55)" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body closeButton className="modelbg">
          <div className="main_change_div">
            <form action="" className="pass_form" onSubmit={handleSubmit}>
              <div className="oldpass">
                <label htmlFor="text">Email</label>
                <div className="old_pass_input_div">
                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    value={values.Email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.Email && touched.Email ? (
                  <p className="errors_msg_p">{errors.Email} </p>
                ) : null}
              </div>

              <div className="pass_sub_btn">
                <Button
                  type="submit"
                  variant="primary"
                  style={{ background: "var(--primary-color-lightgreen)" }}
                  // onClick={handleClose}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
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

export const ChangepasswordModel = () => {
  const { changePasswordshow, setchangePasswordshow } =
    useContext(GlobalContext);
  const handleClose = () => {
    setchangePasswordshow(false);
  };

  const initialValues = {
    oldpassword: "",
    Newpassword: "",
    confirmpassword: "",
  };
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const onSubmit = async (values, { resetForm }) => {
    try {
      const Response = await axios.put(
        "admin/change_password",
        {
          current_password: values.oldpassword,
          new_password: values.Newpassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      console.log("🚀 ~ onSubmit ~ Response:", Response);
      if (Response?.data.status === 1) {
        toast.success(Response.data.message, {
          position: "top-right",
        });
        setchangePasswordshow(false);
        resetForm();
      } else {
        toast.error(Response.data.message, {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: "top-right",
      });
      console.log(error);
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
    validationSchema: ChnagepasswordSchemas,
    onSubmit,
  });
  // : () => {
  // console.log(values);
  // resetForm();
  // },
  return (
    <>
      <Toaster />
      <Modal
        size="ms"
        show={changePasswordshow}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "rgba(159, 160, 163, 0.55)" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title>Chnage Password</Modal.Title>
        </Modal.Header>
        <Modal.Body closeButton className="modelbg">
          <div className="main_change_div">
            <form action="" className="pass_form" onSubmit={handleSubmit}>
              <div className="oldpass">
                <label htmlFor="text">Old Password</label>
                <div className="old_pass_input_div">
                  <input
                    type="text"
                    id="oldpassword"
                    name="oldpassword"
                    value={values.oldpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="old Password"
                  />
                </div>
                {errors.oldpassword && touched.oldpassword ? (
                  <p className="errors_msg_p">{errors.oldpassword} </p>
                ) : null}
              </div>
              <div className="oldpass">
                <label htmlFor="text">New Password</label>
                <div className="old_pass_input_div">
                  <input
                    type="text"
                    id="Newpassword"
                    name="Newpassword"
                    value={values.Newpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="New password"
                  />
                </div>
                {errors.Newpassword && touched.Newpassword ? (
                  <p className="errors_msg_p">{errors.Newpassword} </p>
                ) : null}
              </div>
              <div className="oldpass">
                <label htmlFor="text">Confirm Password</label>
                <div className="old_pass_input_div">
                  <input
                    type="text"
                    id="confirmpassword"
                    name="confirmpassword"
                    value={values.confirmpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm Password"
                  />
                </div>
                {errors.confirmpassword && touched.confirmpassword ? (
                  <p className="errors_msg_p">{errors.confirmpassword} </p>
                ) : null}
              </div>
              <div className="pass_sub_btn">
                <Button
                  type="submit"
                  variant="primary"
                  style={{ background: "var(--primary-color-lightgreen)" }}
                  // onClick={handleClose}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export const LogoutModel = () => {
  const { LogoutModalshow, setLogoutModalshow } = useContext(GlobalContext);
  const navigate = useNavigate();
  const handleClose = () => {
    setLogoutModalshow(false);
  };
  const handlelogout = () => {
    setLogoutModalshow(false);
    localStorage.removeItem("responseData");
    localStorage.removeItem("MYtokan");
    navigate("/Login");
  };
  return (
    <>
      <Modal
        size="sm"
        show={LogoutModalshow}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "rgba(159, 160, 163, 0.55)" }}
      >
        <Modal.Body closeButton className="modelbg">
          <Modal.Title style={{ textAlign: "center" }}>Log out !</Modal.Title>
          <p>Are you sure, you want to Logout ?</p>

          <div className="btn_of_delte_model">
            <Button variant="secondary" onClick={handleClose}>
              No
            </Button>
            <Button
              variant="primary"
              style={{ background: "var(--primary-color-lightgreen)" }}
              onClick={handlelogout}
            >
              Yes
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export const OtpVerifyModel = () => {
  const {
    OtpverifyModel,
    setOtpverifyModel,
    mailOTP,
    setmailOTP,
    setUpadatePasswordmodel,
  } = useContext(GlobalContext);

  const handleClose = () => {
    setOtpverifyModel(false);
  };
  const [otp, setOtp] = useState("");
  const [loading, setloading] = useState(false);
  const handelSubmit = async () => {
    setloading(true);
    try {
      setloading(false);
      const response = await axios.post(
        "admin/verify_otp",
        {
          otp: otp,
          email: mailOTP,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      console.log("🚀 ~ handelSubmit ~ response:", response);

      if (response?.data?.status === 1) {
        toast.success(response?.data?.message, {
          position: "top-right",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        setOtp("");
        handleClose();
        setUpadatePasswordmodel(true);
        localStorage.setItem(
          "Login Response",
          JSON.stringify(response?.data?.data)
        );
        localStorage.setItem(
          "MYtokan",
          JSON.stringify(response?.data?.data?.token)
        );
      } else
        toast.error(response?.data?.message, {
          position: "top-right",
        });
    } catch (error) {
      console.log("🚀 ~ handelSubmit ~ error:", error);
      toast.error(error?.response?.data?.message, {
        position: "top-right",
      });
      setloading(false);
    }
  };
  // const handelSubmit = () => {
  //   setOtp("");
  //   handleClose();
  //   setUpadatePasswordmodel(true);
  // };
  return (
    <>
      <Modal
        size="md"
        show={OtpverifyModel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "rgba(159, 160, 163, 0.55)" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title>Verification OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body closeButton className="modelbg">
          <div className="OTP_main_div">
            <div className="otp_enter_div">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
              />
            </div>
            <div className="pass_sub_btn">
              <Button
                onClick={() => handelSubmit()}
                variant="primary"
                style={{ background: "var(--primary-color-lightgreen)" }}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
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

export const UpdatepasswordModel = () => {
  const { UpadatePasswordmodel, setUpadatePasswordmodel, mailOTP, setmailOTP } =
    useContext(GlobalContext);
  const [loading, setloading] = useState(false);
  const handleClose = () => {
    setUpadatePasswordmodel(false);
  };

  const initialValues = {
    Newpassword: "",
    confirmpassword: "",
  };
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const onSubmit = async (values, { resetForm }) => {
    try {
      setloading(true);
      const Response = await axios.post(
        "admin/update_password",
        {
          new_password: values.Newpassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );

      setloading(false);
      if (Response?.data?.status === 1) {
        toast.success(Response.data.message, {
          position: "top-right",
        });
        setUpadatePasswordmodel(false);
        resetForm();
        setmailOTP();
      } else
        toast.error(Response?.data?.message, {
          position: "top-right",
        });
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      setloading(false);
      toast.error(error?.response?.data?.message, {
        position: "top-right",
      });
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
    validationSchema: UpdatepasswordSchemas,
    onSubmit,
    // onSubmit: (value, { resetForm }) => {
    //   console.log(values);
    //   resetForm();
    //   setUpadatePasswordmodel(false);
    //   resetForm();
    //   setmailOTP();
    // },
  });
  return (
    <>
      <Toaster />
      <Modal
        size="ms"
        show={UpadatePasswordmodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "rgba(159, 160, 163, 0.55)" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title>Update password</Modal.Title>
        </Modal.Header>
        <Modal.Body closeButton className="modelbg">
          <div className="main_change_div">
            <form action="" className="pass_form" onSubmit={handleSubmit}>
              <div className="oldpass">
                <label htmlFor="text">New Password</label>
                <div className="old_pass_input_div">
                  <input
                    type="text"
                    id="Newpassword"
                    name="Newpassword"
                    value={values.Newpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="New Password"
                  />
                </div>
                {errors.Newpassword && touched.Newpassword ? (
                  <p className="errors_msg_p">{errors.Newpassword} </p>
                ) : null}
              </div>
              <div className="oldpass">
                <label htmlFor="text">Confirm password</label>
                <div className="old_pass_input_div">
                  <input
                    type="text"
                    id="confirmpassword"
                    name="confirmpassword"
                    value={values.confirmpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm password"
                  />
                </div>
                {errors.confirmpassword && touched.confirmpassword ? (
                  <p className="errors_msg_p">{errors.confirmpassword} </p>
                ) : null}
              </div>
              <div className="pass_sub_btn">
                <Button
                  type="submit"
                  variant="primary"
                  style={{ background: "var(--primary-color-lightgreen)" }}
                  // onClick={handleClose}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
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
