import React, { useContext, useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Bannermodel.css";
import { SerivesSchemas } from "../../../schemas/index";
import axios from "../../../Common/Api/Api";
import { useFormik } from "formik";
import { toast, Toaster } from "react-hot-toast";
import { GlobalContext } from "../../../GlobalContext";
import { RiImageAddFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io"; // cross icon
import { Backdrop } from "@mui/material";
import Loader from "../../../Common/loader/index";
export const AddBannerModel = () => {
  const {
    AddBannermodel,
    setAddBannermodel,
    EditBannermodel,
    setEditBannermodel,
    DeleteBannermodel,
    setDeleteBannermodel,
    SelectedBanner,
    setSelectedBanner,
    reloadBannerList,
    setreloadBannerList,
  } = useContext(GlobalContext);

  const handleClose = () => {
    setAddBannermodel(false);
  };

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setloading] = useState(false);
  const fileInputRef = useRef(null);
  const initialValues = {
    image: null,
  };
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const onSubmit = async (values, { resetForm }) => {
    setloading(true);
    try {
      const formData = new FormData();

      formData.append("banner_image", values.image);
      const Response = await axios.post("/admin_view/add_banner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${MyToken}`,
        },
      });
      // Reset form + states
      resetForm();
      setPreviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // clear file input

      setreloadBannerList(true);
      handleClose();
      setloading(false);
    } catch (error) {
      setloading(false);
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
    initialValues,
    onSubmit,
  });

  console.log(values.image);
  // handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateImage(file);
  };

  // handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateImage(file);
  };

  // common validation function
  const validateImage = (file) => {
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === 354 && img.height === 146) {
        setPreviewImage(URL.createObjectURL(file));
        setFieldValue("image", file);
      } else {
        toast.error("Image size must be 354×146 pixels", {
          position: "top-right",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
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

  return (
    <>
      <Modal
        size="md"
        show={AddBannermodel}
        onHide={handleClose}
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Add Banner</Modal.Title>
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
                  <div className="upload_info">
                    <RiImageAddFill
                      style={{ fontSize: "40px", color: "#004d61" }}
                    />
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        marginBottom: "8px",
                      }}
                    >
                      Please upload an image of size{" "}
                      <strong>354×146 pixels</strong> only.
                    </p>
                  </div>
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
export const EditBannerModel = () => {
  const {
    EditBannermodel,
    setEditBannermodel,
    SelectedBanner,
    setSelectedBanner,
    reloadBannerList,
    setreloadBannerList,
  } = useContext(GlobalContext);

  const handleClose = () => {
    setEditBannermodel(false);
  };

  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const initialValues = {
    image: null,
  };
  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const onSubmit = async (values, { resetForm }) => {
    setloading(true);
    try {
      const formData = new FormData();

      formData.append("banner_id", SelectedBanner.id);
      formData.append("banner_image", values.image);
      const Response = await axios.put("/admin_view/add_banner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${MyToken}`,
        },
      });
      resetForm();
      setreloadBannerList(true);
      handleClose();
      setPreviewImage(null);
      setloading(false);
      console.log("🚀 ~ onSubmit ~ Response:", Response);
    } catch (error) {
      setloading(false);
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
    initialValues,

    onSubmit,
    // onSubmit: (values, { resetForm }) => {
    //   console.log(values);

    // },
  });

  // handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateImage(file);
  };

  // handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateImage(file);
  };

  // common validation function
  const validateImage = (file) => {
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === 354 && img.height === 146) {
        setPreviewImage(URL.createObjectURL(file));
        setFieldValue("image", file);
      } else {
        toast.error("Image size must be 354×146 pixels", {
          position: "top-right",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
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
  useEffect(() => {
    if (SelectedBanner) {
      setPreviewImage(SelectedBanner.banner_image);
    }
  }, [SelectedBanner, setValues]);
  return (
    <>
      <Modal
        size="md"
        show={EditBannermodel}
        onHide={handleClose}
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Edit Banner</Modal.Title>
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
                  <div className="upload_info">
                    <RiImageAddFill
                      style={{ fontSize: "40px", color: "#004d61" }}
                    />
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        marginBottom: "8px",
                      }}
                    >
                      Please upload an image of size{" "}
                      <strong>354×146 pixels</strong> only.
                    </p>
                  </div>
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

export const DeleteBannerModel = () => {
  const {
    DeleteBannermodel,
    setDeleteBannermodel,
    SelectedBanner,
    setSelectedBanner,
    reloadBannerList,
    setreloadBannerList,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setDeleteBannermodel(false);
  };
  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const handleDelete = async () => {
    setloading(true);
    try {
      const response = await axios.delete("/admin_view/add_banner", {
        data: { banner_id: SelectedBanner.id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      // console.log("🚀 ~ handleDelete ~ response.headers:", response.headers);
      console.log("🚀 ~ handleDelete ~ response:", response);
      toast.success(response.data.message, {
        position: "top-right",
      });
      setloading(false);
      handleClose();
      setreloadBannerList(true);
      setSelectedBanner("");
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      setloading(false);
    }
  };
  return (
    <>
      <Modal
        size="md"
        show={DeleteBannermodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Delete Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <p>Are you sure, you want to Delete this Banner ?</p>

            <div className="btn_of_delte_model">
              <Button variant="secondary" onClick={handleClose}>
                No
              </Button>
              <Button
                variant="primary"
                style={{
                  background: "var(--main-background-color-dark-green)",
                }}
                onClick={() => handleDelete()}
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
