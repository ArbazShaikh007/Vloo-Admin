import React, { useContext, useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Services.css";
import { SerivesSchemas } from "../../../schemas/index";
import axios from "../../../Common/Api/Api";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { GlobalContext } from "../../../GlobalContext";
import { RiImageAddFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io"; // cross icon
import { Backdrop } from "@mui/material";
import Loader from "../../../Common/loader/index";

/* =========================
   AddServiceModel
   ========================= */
export const AddServiceModel = () => {
  const {
    AddServicemodel,
    setAddServicemodel,
    reloadServiceList,
    setreloadServiceList,
  } = useContext(GlobalContext);

  const handleClose = () => {
    setAddServicemodel(false);
  };
  const [loading, setloading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const initialValues = {
    serviceName: "",
    servicedesc: "",
    rate: "",
    image: null,
    // NEW FIELDS
    serviceNameAr: "",
    serviceDescAr: "",
    serviceNameBn: "",
    serviceDescBn: "",
  };
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const onSubmit = async (values, { resetForm }) => {
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("service_name", values.serviceName);
      formData.append("service_description", values.servicedesc);
      formData.append("service_price", values.rate);
      formData.append("service_image", values.image);

      // NEW: Optional locale fields
      if (values.serviceNameAr) formData.append("service_name_ar", values.serviceNameAr);
      if (values.serviceDescAr) formData.append("service_description_ar", values.serviceDescAr);
      if (values.serviceNameBn) formData.append("service_name_bn", values.serviceNameBn);
      if (values.serviceDescBn) formData.append("service_description_bn", values.serviceDescBn);

      const response = await axios.post("/admin_view/add_service", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${MyToken}`,
        },
      });
      toast.success(response.data.message, { position: "top-right" });
      setreloadServiceList(true);
      setloading(false);
      resetForm();
      setPreviewImage(null);
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.massage || "Failed", { position: "top-right" });
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
    initialValues,
    validationSchema: SerivesSchemas,
    onSubmit,
  });

  // handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue("image", file);
    }
  };

  // handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue("image", file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // remove image
  const removeImage = () => {
    setPreviewImage(null);
    setFieldValue("image", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // price input limit
  const handlePriceChange = (e) => {
    let val = e.target.value;
    if (val === "" || parseInt(val) <= 999) {
      handleChange(e);
    }
  };

  return (
    <>
      <Modal
        size="md"
        show={AddServicemodel}
        onHide={handleClose}
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Add Service</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <form className="main_div_of_form" onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div
                className="image_upload_div"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
                style={{ position: "relative", cursor: "pointer" }}
              >
                {previewImage ? (
                  <>
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "red",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <IoMdClose />
                    </button>
                  </>
                ) : (
                  <RiImageAddFill
                    style={{ fontSize: "40px", color: "#004d61" }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
              {errors.image && touched.image ? (
                <p className="errors_msg_p">{errors.image}</p>
              ) : null}

              {/* Service Name */}
              <div className="input_filed_div">
                <label>Service Name</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="serviceName"
                    value={values.serviceName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.serviceName && touched.serviceName ? (
                  <p className="errors_msg_p">{errors.serviceName}</p>
                ) : null}
              </div>

              {/* NEW: Service Name (Arabic) */}
              <div className="input_filed_div">
                <label>Service Name (Arabic)</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="serviceNameAr"
                    value={values.serviceNameAr}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* NEW: Service Name (Bengali) */}
              <div className="input_filed_div">
                <label>Service Name (Bengali)</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="serviceNameBn"
                    value={values.serviceNameBn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* Service Description */}
              <div className="input_filed_div">
                <label>Service Description</label>
                <div className="textarea_field_box">
                  <textarea
                    name="servicedesc"
                    value={values.servicedesc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></textarea>
                </div>
                {errors.servicedesc && touched.servicedesc ? (
                  <p className="errors_msg_p">{errors.servicedesc}</p>
                ) : null}
              </div>

              {/* NEW: Service Description (Arabic) */}
              <div className="input_filed_div">
                <label>Service Description (Arabic)</label>
                <div className="textarea_field_box">
                  <textarea
                    name="serviceDescAr"
                    value={values.serviceDescAr}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    dir="rtl"
                  ></textarea>
                </div>
              </div>

              {/* NEW: Service Description (Bengali) */}
              <div className="input_filed_div">
                <label>Service Description (Bengali)</label>
                <div className="textarea_field_box">
                  <textarea
                    name="serviceDescBn"
                    value={values.serviceDescBn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></textarea>
                </div>
              </div>

              {/* Price */}
              <div className="input_filed_div">
                <label>Service Price</label>
                <div className="input_field_box">
                  <input
                    type="number"
                    name="rate"
                    value={values.rate}
                    onChange={handlePriceChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.rate && touched.rate ? (
                  <p className="errors_msg_p">{errors.rate}</p>
                ) : null}
              </div>

              {/* Submit */}
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

/* =========================
   EditServiceModel
   ========================= */
export const EditServiceModel = () => {
  const {
    EditServicemodel,
    setEditServicemodel,
    DeleteServicemodel,
    setDeleteServicemodel,
    SelectedService,
    setSelectedService,
    reloadServiceList,
    setreloadServiceList,
  } = useContext(GlobalContext);

  const handleClose = () => {
    setEditServicemodel(false);
  };
  const [loading, setloading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const initialValues = {
    serviceName: "",
    servicedesc: "",
    rate: "",
    image: null,
    // NEW FIELDS
    serviceNameAr: "",
    serviceDescAr: "",
    serviceNameBn: "",
    serviceDescBn: "",
  };
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const onSubmit = async (values, { resetForm }) => {
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("service_id", SelectedService.id);
      formData.append("service_name", values.serviceName);
      formData.append("service_description", values.servicedesc);
      formData.append("service_price", values.rate);

      if (values.image && typeof values.image !== "string") {
        formData.append("service_image", values.image);
      }

      // NEW: Optional locale fields
      if (values.serviceNameAr) formData.append("service_name_ar", values.serviceNameAr);
      if (values.serviceDescAr) formData.append("service_description_ar", values.serviceDescAr);
      if (values.serviceNameBn) formData.append("service_name_bn", values.serviceNameBn);
      if (values.serviceDescBn) formData.append("service_description_bn", values.serviceDescBn);

      const response = await axios.put("/admin_view/add_service", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${MyToken}`,
        },
      });
      toast.success(response.data.message, { position: "top-right" });
      setreloadServiceList(true);
      setloading(false);
      resetForm();
      setPreviewImage(null);
      setSelectedService();
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.massage || "Failed", { position: "top-right" });
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
    setValues,
  } = useFormik({
    initialValues,
    // validationSchema: SerivesSchemas, // unchanged (was commented in your code)
    onSubmit,
  });

  // handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue("image", file);
    }
  };

  // handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue("image", file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // remove image
  const removeImage = () => {
    setPreviewImage(null);
    setFieldValue("image", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // price input limit
  const handlePriceChange = (e) => {
    let val = e.target.value;
    if (val === "" || parseInt(val) <= 999) {
      handleChange(e);
    }
  };

  useEffect(() => {
    if (SelectedService) {
      setValues({
        serviceName: SelectedService?.service_name,
        servicedesc: SelectedService?.service_description,
        rate: SelectedService?.service_price,
        image: SelectedService?.service_image,
        // NEW: Prefill if backend sends them
        serviceNameAr: SelectedService?.service_name_ar || "",
        serviceDescAr: SelectedService?.service_description_ar || "",
        serviceNameBn: SelectedService?.service_name_bn || "",
        serviceDescBn: SelectedService?.service_description_bn || "",
      });
      setPreviewImage(SelectedService?.service_image);
    }
  }, [SelectedService, setValues]);

  return (
    <>
      <Modal
        size="md"
        show={EditServicemodel}
        onHide={handleClose}
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <form className="main_div_of_form" onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div
                className="image_upload_div"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
                style={{ position: "relative", cursor: "pointer" }}
              >
                {previewImage ? (
                  <>
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "red",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <IoMdClose />
                    </button>
                  </>
                ) : (
                  <RiImageAddFill
                    style={{ fontSize: "40px", color: "#004d61" }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
              {errors.image && touched.image ? (
                <p className="errors_msg_p">{errors.image}</p>
              ) : null}

              {/* Service Name */}
              <div className="input_filed_div">
                <label>Service Name</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="serviceName"
                    value={values.serviceName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.serviceName && touched.serviceName ? (
                  <p className="errors_msg_p">{errors.serviceName}</p>
                ) : null}
              </div>

              {/* NEW: Service Name (Arabic) */}
              <div className="input_filed_div">
                <label>Service Name (Arabic)</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="serviceNameAr"
                    value={values.serviceNameAr}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* NEW: Service Name (Bengali) */}
              <div className="input_filed_div">
                <label>Service Name (Bengali)</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="serviceNameBn"
                    value={values.serviceNameBn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* Service Description */}
              <div className="input_filed_div">
                <label>Service Description</label>
                <div className="textarea_field_box">
                  <textarea
                    name="servicedesc"
                    value={values.servicedesc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></textarea>
                </div>
                {errors.servicedesc && touched.servicedesc ? (
                  <p className="errors_msg_p">{errors.servicedesc}</p>
                ) : null}
              </div>

              {/* NEW: Service Description (Arabic) */}
              <div className="input_filed_div">
                <label>Service Description (Arabic)</label>
                <div className="textarea_field_box">
                  <textarea
                    name="serviceDescAr"
                    value={values.serviceDescAr}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    dir="rtl"
                  ></textarea>
                </div>
              </div>

              {/* NEW: Service Description (Bengali) */}
              <div className="input_filed_div">
                <label>Service Description (Bengali)</label>
                <div className="textarea_field_box">
                  <textarea
                    name="serviceDescBn"
                    value={values.serviceDescBn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></textarea>
                </div>
              </div>

              {/* Price */}
              <div className="input_filed_div">
                <label>Service Price</label>
                <div className="input_field_box">
                  <input
                    type="number"
                    name="rate"
                    value={values.rate}
                    onChange={handlePriceChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.rate && touched.rate ? (
                  <p className="errors_msg_p">{errors.rate}</p>
                ) : null}
              </div>

              {/* Submit */}
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

/* =========================
   DeleteServiceModel (unchanged)
   ========================= */
export const DeleteServiceModel = () => {
  const {
    DeleteServicemodel,
    setDeleteServicemodel,
    SelectedService,
    setSelectedService,
    reloadServiceList,
    setreloadServiceList,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setDeleteServicemodel(false);
  };
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const [loading, setloading] = useState(false);

  const handleDelete = async () => {
    setloading(true);
    try {
      const response = await axios.delete("/admin_view/add_service", {
        data: { service_id: SelectedService.id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      toast.success(response.data.message, {
        position: "top-right",
      });
      setloading(false);
      handleClose();
      setreloadServiceList(true);
      setSelectedService("");
    } catch (error) {
      setloading(false);
    }
  };

  return (
    <>
      <Modal
        size="md"
        show={DeleteServicemodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Delete Service</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <p>Are you sure, you want to Delete this Service ?</p>

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
