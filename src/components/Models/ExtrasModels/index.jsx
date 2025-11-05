import React, { useContext, useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Services.css"; // keeping your existing styles
import { ExtrasSchemas, SerivesSchemas } from "../../../schemas/index";
import axios from "../../../Common/Api/Api";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { GlobalContext } from "../../../GlobalContext";
import { RiImageAddFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io"; // cross icon
import { Backdrop } from "@mui/material";
import Loader from "../../../Common/loader/index";

/* ===========================
   ADD EXTRAS
=========================== */
export const AddExtrasModel = () => {
  const {
    AddExtrasmodel,
    setAddExtrasmodel,
    reloadExtrasList,
    setreloadExtrasList,
  } = useContext(GlobalContext);

  const handleClose = () => {
    setAddExtrasmodel(false);
  };
  const [loading, setloading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const initialValues = {
    extrasName: "",
    extrasNameAr: "",
    extrasNameBn: "",
    rate: "",
    image: null,
  };

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const onSubmit = async (values, { resetForm }) => {
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.extrasName);
      formData.append("name_ar", values.extrasNameAr || "");
      formData.append("name_bn", values.extrasNameBn || "");
      formData.append("price", values.rate);
      formData.append("image", values.image);

      const response = await axios.post("/admin_view/add_extras", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${MyToken}`,
        },
      });

      toast.success(response.data.message, { position: "top-right" });
      setreloadExtrasList(true);
      setloading(false);
      resetForm();
      setPreviewImage(null);
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.massage || "Failed", {
        position: "top-right",
      });
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
    validationSchema: ExtrasSchemas,
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
        show={AddExtrasmodel}
        onHide={handleClose}
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Add Extras</Modal.Title>
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

              {/* Extra Name (EN) */}
              <div className="input_filed_div">
                <label>Extra Name (EN)</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="extrasName"
                    value={values.extrasName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.extrasName && touched.extrasName ? (
                  <p className="errors_msg_p">{errors.extrasName}</p>
                ) : null}
              </div>

              {/* Extra Name AR */}
              <div className="input_filed_div">
                <label>Extra Name (AR)</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="extrasNameAr"
                    value={values.extrasNameAr}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    dir="rtl"
                  />
                </div>
                {errors.extrasNameAr && touched.extrasNameAr ? (
                  <p className="errors_msg_p">{errors.extrasNameAr}</p>
                ) : null}
              </div>

              {/* Extra Name BN */}
              <div className="input_filed_div">
                <label>Extra Name (BN)</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="extrasNameBn"
                    value={values.extrasNameBn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.extrasNameBn && touched.extrasNameBn ? (
                  <p className="errors_msg_p">{errors.extrasNameBn}</p>
                ) : null}
              </div>

              {/* Price */}
              <div className="input_filed_div">
                <label>Extra Price</label>
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

/* ===========================
   EDIT EXTRAS
=========================== */
export const EditExtraModel = () => {
  const {
    EditExtrasmodel,
    setEditExtrasmodel,
    SelectedExtras,
    setSelectedExtras,
    reloadExtrasList,
    setreloadExtrasList,
  } = useContext(GlobalContext);

  const handleClose = () => {
    setEditExtrasmodel(false);
  };

  const [loading, setloading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const initialValues = {
    extrasName: "",
    extrasNameAr: "",
    extrasNameBn: "",
    rate: "",
    image: null,
  };

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const onSubmit = async (values, { resetForm }) => {
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("extra_id", SelectedExtras.id);
      formData.append("name", values.extrasName);
      formData.append("name_ar", values.extrasNameAr || "");
      formData.append("name_bn", values.extrasNameBn || "");
      formData.append("price", values.rate);

      // only append image if user uploaded a new file
      if (values.image && typeof values.image !== "string") {
        formData.append("image", values.image);
      }

      const response = await axios.put("/admin_view/add_extras", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${MyToken}`,
        },
      });

      toast.success(response.data.message, { position: "top-right" });
      setreloadExtrasList(true);
      setloading(false);
      resetForm();
      setPreviewImage(null);
      setSelectedExtras();
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.massage || "Failed", {
        position: "top-right",
      });
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
    onSubmit,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue("image", file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue("image", file);
    }
  };
  const handleDragOver = (e) => e.preventDefault();

  const removeImage = () => {
    setPreviewImage(null);
    setFieldValue("image", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePriceChange = (e) => {
    let val = e.target.value;
    if (val === "" || parseInt(val) <= 999) {
      handleChange(e);
    }
  };

  useEffect(() => {
    if (SelectedExtras) {
      setValues({
        extrasName: SelectedExtras?.name || "",
        extrasNameAr: SelectedExtras?.name_ar || "",
        extrasNameBn: SelectedExtras?.name_bn || "",
        rate: SelectedExtras?.price || "",
        image: SelectedExtras?.image || null,
      });
      setPreviewImage(SelectedExtras?.image || null);
    }
  }, [SelectedExtras, setValues]);

  return (
    <>
      <Modal
        size="md"
        show={EditExtrasmodel}
        onHide={handleClose}
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Edit Extras</Modal.Title>
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

              {/* Extra Name (EN) */}
              <div className="input_filed_div">
                <label>Extra Name (EN)</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="extrasName"
                    value={values.extrasName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.extrasName && touched.extrasName ? (
                  <p className="errors_msg_p">{errors.extrasName}</p>
                ) : null}
              </div>

              {/* Extra Name (AR) */}
              <div className="input_filed_div">
                <label>Extra Name (AR)</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="extrasNameAr"
                    value={values.extrasNameAr}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    dir="rtl"
                  />
                </div>
                {errors.extrasNameAr && touched.extrasNameAr ? (
                  <p className="errors_msg_p">{errors.extrasNameAr}</p>
                ) : null}
              </div>

              {/* Extra Name (BN) */}
              <div className="input_filed_div">
                <label>Extra Name (BN)</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="extrasNameBn"
                    value={values.extrasNameBn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.extrasNameBn && touched.extrasNameBn ? (
                  <p className="errors_msg_p">{errors.extrasNameBn}</p>
                ) : null}
              </div>

              {/* Price */}
              <div className="input_filed_div">
                <label>Extra Price</label>
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

/* ===========================
   DELETE EXTRAS
=========================== */
export const DeleteExtraModel = () => {
  const {
    DeleteExtrasmodel,
    setDeleteExtrasmodel,
    SelectedExtras,
    setSelectedExtras,
    reloadExtrasList,
    setreloadExtrasList,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setDeleteExtrasmodel(false);
  };
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const [loading, setloading] = useState(false);

  const handleDelete = async () => {
    setloading(true);
    try {
      const response = await axios.delete("/admin_view/add_extras", {
        data: { extra_id: SelectedExtras.id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      toast.success(response.data.message, { position: "top-right" });
      setloading(false);
      handleClose();
      setreloadExtrasList(true);
      setSelectedExtras("");
    } catch (error) {
      setloading(false);
    }
  };

  return (
    <>
      <Modal
        size="md"
        show={DeleteExtrasmodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Delete Extras</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <p>Are you sure, you want to Delete this Extras ?</p>

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
