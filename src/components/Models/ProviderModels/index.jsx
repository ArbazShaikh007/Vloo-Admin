import React from "react";
import { useContext, useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./ProviderModels.css";
import {
  ForgotSchemas,
  ChnagepasswordSchemas,
  ProviderSchemas,
} from "../../../schemas/index";
import axios from "../../../Common/Api/Api";
import { useFormik } from "formik";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../GlobalContext";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumber } from "react-phone-number-input";

export const AddproviderModel = () => {
  const {
    Addprovidermodel,
    setAddprovidermodel,
    Editprovidermodel,
    setEditprovidermodel,
    Deleteprovidermodel,
    setDeleteprovidermodel,
    Selectedprovider,
    setSelectedprovider,
    reloadProviderList,
    setreloadProviderList,
    is_subadmin,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setAddprovidermodel(false);
  };
  const initialValues = {
    Name: "",
    Email: "",
    Number: "",
  };
  const [value, setValue] = useState();

  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const onSubmit = async (values, { resetForm }) => {
    try {
      // ✅ Parse phone number
      let countryCode = "";
      let mobileNumber = "";
      if (value) {
        try {
          const phoneNumber = parsePhoneNumber(value);
          countryCode = "+" + phoneNumber.countryCallingCode;
          mobileNumber = phoneNumber.nationalNumber;
        } catch (err) {
          console.log("Invalid phone number", err);
        }
      }

      // ✅ Detect timezone automatically
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      setloading(true);
      const endpoint = is_subadmin
        ? "admin_view/add_provider"
        : "admin_view/add_main_provider";

      const response = await axios.post(
        endpoint,
        {
          name: values.Name,
          email: values.Email,
          country_code: countryCode,
          mobile_number: mobileNumber,
          timezone: timezone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      console.log("🚀 ~ onSubmit ~ response:", response);
      toast.success(response.data.message, { position: "top-right" });
      setloading(false);
      setreloadProviderList(true);
      handleClose();
      resetForm();
      setValue();
    } catch (error) {
      setloading(false);
      toast.error(error.response.data.message, { position: "top-right" });
      console.log("🚀 ~ onSubmit ~ error:", error);
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
    validationSchema: ProviderSchemas,
    onSubmit,
  });
  useEffect(() => {
    if (value) {
      setFieldValue("Number", value);
    }
  }, [value, setFieldValue]);
  return (
    <>
      <Modal
        size="md"
        show={Addprovidermodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>
            {is_subadmin ? "Add New Worker" : "Add Service Provider"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <form className="main_div_of_form" onSubmit={handleSubmit}>
              <div className="input_filed_div">
                <label htmlFor="">Name</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="Name"
                    value={values.Name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.Name && touched.Name ? (
                  <p className="errors_msg_p">{errors.Name} </p>
                ) : null}
              </div>
              <div className="input_filed_div">
                <label htmlFor="">Email</label>
                <div className="input_field_box">
                  <input
                    type="text"
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
              <div className="input_filed_div">
                <label htmlFor="">Mobile Number</label>
                <div className="input_field_box">
                  <PhoneInput
                    className="PhoneInput"
                    country="SA"
                    defaultCountry="SA"
                    international
                    countryCallingCodeEditable={false}
                    placeholder="98980 98980"
                    value={value}
                    maxLength={16}
                    onChange={(e) => {
                      const numValue = e;
                      if (numValue?.length <= 16) {
                        setValue(numValue);
                      }
                    }}
                  />
                </div>
                {errors.Number && touched.Number ? (
                  <p className="errors_msg_p">{errors.Number} </p>
                ) : null}
              </div>
              <div className="pass_sub_btn">
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    background: "var(--main-background-color-dark-green)",
                  }}
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

export const EditproviderModel = () => {
  const {
    Editprovidermodel,
    setEditprovidermodel,
    Deleteprovidermodel,
    setDeleteprovidermodel,
    Selectedprovider,
    setSelectedprovider,
    reloadProviderList,
    setreloadProviderList,
    is_subadmin,
  } = useContext(GlobalContext);
  console.log("🚀 ~ EditproviderModel ~ Selectedprovider:", Selectedprovider);
  const handleClose = () => {
    setEditprovidermodel(false);
  };
  const initialValues = {
    Name: "",
    Email: "",
    Number: "",
  };

  const [value, setValue] = useState();

  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const onSubmit = async (values, { resetForm }) => {
    try {
      // ✅ Parse phone number
      let countryCode = "";
      let mobileNumber = "";
      if (value) {
        try {
          const phoneNumber = parsePhoneNumber(value);
          countryCode = "+" + phoneNumber.countryCallingCode;
          mobileNumber = phoneNumber.nationalNumber;
        } catch (err) {
          console.log("Invalid phone number", err);
        }
      }

      // ✅ Detect timezone automatically
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      setloading(true);
      const endpoint = is_subadmin
        ? "admin_view/add_provider"
        : "admin_view/add_main_provider";

      const response = await axios.put(
        endpoint,
        {
          provider_id: Selectedprovider.id,
          name: values.Name,
          email: values.Email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      console.log("🚀 ~ onSubmit ~ response:", response);
      toast.success(response.data.message, { position: "top-right" });
      setloading(false);
      setreloadProviderList(true);
      handleClose();
      resetForm();
      setValue();
    } catch (error) {
      setloading(false);
      toast.error(error.response.data.message, { position: "top-right" });
      console.log("🚀 ~ onSubmit ~ error:", error);
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
    onSubmit,
  });

  useEffect(() => {
    if (value) {
      setFieldValue("Number", value);
    }
  }, [value, setFieldValue]);

  useEffect(() => {
    if (Selectedprovider) {
      setValues({
        Name: Selectedprovider.name,
        Email: Selectedprovider.email,
      });

      if (Selectedprovider.countryCode && Selectedprovider.mobile) {
        setValue(`${Selectedprovider.countryCode}${Selectedprovider.mobile}`);
      }
    }
  }, [Selectedprovider, setValues]);
  return (
    <>
      <Modal
        size="md"
        show={Editprovidermodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>
            Edit Service Provider
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <form className="main_div_of_form" onSubmit={handleSubmit}>
              <div className="input_filed_div">
                <label htmlFor="">Name</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="Name"
                    value={values.Name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.Name && touched.Name ? (
                  <p className="errors_msg_p">{errors.Name} </p>
                ) : null}
              </div>
              <div className="input_filed_div">
                <label htmlFor="">Email</label>
                <div className="input_field_box">
                  <input
                    type="text"
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
              <div className="input_filed_div">
                <label htmlFor="">Mobile Number</label>
                <div className="input_field_box">
                  <PhoneInput
                    className="PhoneInput"
                    country="SA"
                    defaultCountry="SA"
                    international
                    countryCallingCodeEditable={false}
                    placeholder="98980 98980"
                    value={value}
                    maxLength={16}
                    onChange={(e) => {
                      const numValue = e;
                      if (numValue?.length <= 16) {
                        setValue(numValue);
                      }
                    }}
                    disabled
                  />
                </div>
                {errors.Number && touched.Number ? (
                  <p className="errors_msg_p">{errors.Number} </p>
                ) : null}
              </div>
              <div className="pass_sub_btn">
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    background: "var(--main-background-color-dark-green)",
                  }}
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

export const DeleteproviderModel = () => {
  const {
    Deleteprovidermodel,
    setDeleteprovidermodel,
    Selectedprovider,
    setSelectedprovider,
    reloadProviderList,
    setreloadProviderList,
    is_subadmin,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setDeleteprovidermodel(false);
  };
  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const handleDelete = async () => {
    setloading(true);
    try {
      const endpoint = is_subadmin
        ? "admin_view/add_provider"
        : "admin_view/add_main_provider";

      const response = await axios.delete(endpoint, {
        data: { provider_id: Selectedprovider.id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      console.log("🚀 ~ handleDelete ~ response:", response);
      toast.success(response.data.message, {
        position: "top-right",
      });
      setloading(false);
      handleClose();
      setreloadProviderList(true);
      setSelectedprovider("");
      toast.success(response.data.message, { position: "top-right" });
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      setloading(false);
      toast.error(error.response.data.message, { position: "top-right" });
    }
  };
  return (
    <>
      <Modal
        size="md"
        show={Deleteprovidermodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>
            Delete Service Provider
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <p>Are you sure, you want to Delete this Service Provider ?</p>

            <div className="btn_of_delte_model">
              <Button variant="secondary" onClick={handleClose}>
                No
              </Button>
              <Button
                variant="primary"
                style={{
                  background: "var(--main-background-color-dark-green)",
                }}
                onClick={handleDelete}
              >
                Yes
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
