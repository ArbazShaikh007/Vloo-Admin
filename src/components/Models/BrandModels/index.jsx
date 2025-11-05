import React, { useContext, useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Brnads.css";
import { CarbrandSchemas, SerivesSchemas } from "../../../schemas/index";
import axios from "../../../Common/Api/Api";
import { useFormik } from "formik";
import { toast, Toaster } from "react-hot-toast";
import { GlobalContext } from "../../../GlobalContext";
import { RiImageAddFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io"; // cross icon
import { Backdrop } from "@mui/material";
import Loader from "../../../Common/loader/index";
export const AddBrandModel = () => {
  const {
    AddBrandmodel,
    setAddBrandmodel,
    EditBrandmodel,
    setEditBrandmodel,
    DeleteBrandmodel,
    setDeleteBrandmodel,
    SelectedBrand,
    setSelectedBrand,
    reloadBrandList,
    setreloadBrandList,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setAddBrandmodel(false);
  };
  const initialValues = {
    BrandName: "",
  };

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const [loading, setloading] = useState(false);
  const onSubmit = async (values, { resetForm }) => {
    try {
      setloading(true);
      const response = await axios.post(
        "admin_view/add_car_brand",
        { name: values.BrandName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );

      toast.success(response.data.message, {
        position: "top-right",
      });
      setreloadBrandList(true);
      setloading(false);
      resetForm();
      handleClose();
    } catch (error) {
      toast.error(error.response.data.message, {
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
    initialValues: initialValues,
    validationSchema: CarbrandSchemas,
    onSubmit,
    // onSubmit: (values, { resetForm }) => {
    //   console.log(values);
    //   resetForm();
    //   handleClose();
    // },
  });

  return (
    <>
      <Modal
        size="md"
        show={AddBrandmodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Add Car Brand</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <form className="main_div_of_form" onSubmit={handleSubmit}>
              <div className="input_filed_div">
                <label htmlFor="">Brand Name</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="BrandName"
                    value={values.BrandName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.BrandName && touched.BrandName ? (
                  <p className="errors_msg_p">{errors.BrandName} </p>
                ) : null}
              </div>

              <div className="pass_sub_btn">
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    background: "var(--main-background-color-dark-green)",
                  }}
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
export const EditBrandModel = () => {
  const {
    EditBrandmodel,
    setEditBrandmodel,
    DeleteBrandmodel,
    setDeleteBrandmodel,
    SelectedBrand,
    setSelectedBrand,
    reloadBrandList,
    setreloadBrandList,
  } = useContext(GlobalContext);

  const handleClose = () => {
    setEditBrandmodel(false);
  };
  const initialValues = {
    BrandName: "",
  };
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const [loading, setloading] = useState(false);
  const onSubmit = async (values, { resetForm }) => {
    try {
      setloading(true);
      const response = await axios.put(
        "admin_view/add_car_brand",
        { name: values.BrandName, brand_id: SelectedBrand.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );

      toast.success(response.data.message, {
        position: "top-right",
      });
      setreloadBrandList(true);
      setloading(false);
      resetForm();
      handleClose();
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      toast.error(error.response.data.message, {
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
    initialValues: initialValues,
    validationSchema: CarbrandSchemas,
    onSubmit,
    // onSubmit: (values, { resetForm }) => {
    //   console.log(values);
    //   resetForm();
    //   handleClose();
    // },
  });

  useEffect(() => {
    if (SelectedBrand) {
      setValues({
        BrandName: SelectedBrand.name,
      });
    }
  }, [SelectedBrand, setValues]);
  return (
    <>
      <Modal
        size="md"
        show={EditBrandmodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Edit Car Brand</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <form className="main_div_of_form" onSubmit={handleSubmit}>
              <div className="input_filed_div">
                <label htmlFor="">Brand Name</label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="BrandName"
                    value={values.BrandName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.BrandName && touched.BrandName ? (
                  <p className="errors_msg_p">{errors.BrandName} </p>
                ) : null}
              </div>

              <div className="pass_sub_btn">
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    background: "var(--main-background-color-dark-green)",
                  }}
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

export const DeleteBrandModel = () => {
  const {
    DeleteBrandmodel,
    setDeleteBrandmodel,
    SelectedBrand,
    setSelectedBrand,
    reloadBrandList,
    setreloadBrandList,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setDeleteBrandmodel(false);
  };

  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const handleDelete = async () => {
    setloading(true);
    try {
      const response = await axios.delete("/admin_view/add_car_brand", {
        data: { brand_id: SelectedBrand.id },
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
      setreloadBrandList(true);
      setSelectedBrand("");
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
      });
      console.log("🚀 ~ handleDelete ~ error:", error);
      setloading(false);
    }
  };
  return (
    <>
      <Modal
        size="md"
        show={DeleteBrandmodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>
            Delete Car Brand
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <p>Are you sure, you want to Delete this Car Brand ?</p>

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
