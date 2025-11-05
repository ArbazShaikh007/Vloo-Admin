import "./Brnads.css";
import React, { useContext, useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  CarbrandSchemas,
  CarModelSchemas,
  SerivesSchemas,
} from "../../../schemas/index";
import axios from "../../../Common/Api/Api";
import { useFormik } from "formik";
import { toast, Toaster } from "react-hot-toast";
import { GlobalContext } from "../../../GlobalContext";
import { RiImageAddFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { Backdrop } from "@mui/material";
import Loader from "../../../Common/loader/index";
import Select from "react-select";
export const AddCarmodalModel = () => {
  const {
    AddCarModelmodel,
    setAddCarModelmodel,
    EditCarModelmodel,
    setEditCarModelmodel,
    DeleteCarModelmodel,
    setDeleteCarModelmodel,
    SelectedCarModel,
    setSelectedCarModel,
    reloadCarModelList,
    setreloadCarModelList,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setAddCarModelmodel(false);
  };
  const initialValues = {
    BrandName: "",
    ModelName: "",
    Year: "",
  };

  const [selectBrand, setSelectBrand] = useState(null);

  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const [brandName, setbrandName] = useState([]);

  const getbrand = async () => {
    try {
      const Response = await axios.get(
        "/admin_view/car_brand_list_no_pagination",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      setbrandName(Response.data.car_brand_list);

      // console.log("🚀 ~ getbrand ~ Response:", Response);
    } catch (error) {
      console.log("🚀 ~ getbrand ~ error:", error);
    }
  };
  useEffect(() => {
    getbrand();
  }, []);
  const brandOptions = brandName?.map((car) => ({
    value: car.id,
    label: car.name,
  }));

  const onSubmit = async (values, { resetForm }) => {
    try {
      setloading(true);
      const response = await axios.post(
        "/admin_view/add_car_model",
        {
          name: values.ModelName,
          year: values.Year,
          brand_id: values.BrandName,
        },
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
      setreloadCarModelList(true);
      setloading(false);
      resetForm();
      handleClose();
      setloading(false);
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
      });
      console.log("🚀 ~ onSubmit ~ error:AddCarmodalModel", error);
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
    validationSchema: CarModelSchemas,
    onSubmit,
    // onSubmit: (values, { resetForm }) => {
    //   console.log(values);
    //   resetForm();
    //   handleClose();
    // },
  });
  // const brandData = [
  //   { id: 1, CarBrand: "Toyota" },
  //   { id: 2, CarBrand: "Hyundai" },
  //   { id: 3, CarBrand: "Nissan" },
  //   { id: 4, CarBrand: "Kia" },
  //   { id: 5, CarBrand: "Ford" },
  //   { id: 6, CarBrand: "Chevrolet" },
  //   { id: 7, CarBrand: "Honda" },
  //   { id: 8, CarBrand: "Lexus" },
  //   { id: 9, CarBrand: "BMW" },
  //   { id: 10, CarBrand: "Mercedes-Benz" },
  // ];

  return (
    <>
      <Modal
        size="md"
        show={AddCarModelmodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Add Car Model</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <form className="main_div_of_form" onSubmit={handleSubmit}>
              <div className="input_filed_div">
                <label htmlFor="">Brand Name</label>
                {/* <div className="input_field_box">
                  <select
                    name="BrandName"
                    value={values.BrandName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Brand Name</option>

                    {brandName.map((item) => {
                      return <option value={item.id}>{item.name}</option>;
                    })}
                  </select>
                </div> */}
                <div className="brand_filter" style={{ width: "100%" }}>
                  <Select
                    styles={{ width: "100%" }}
                    options={brandOptions}
                    value={
                      brandOptions.find(
                        (option) => option.value === values.BrandName
                      ) || null
                    }
                    onChange={(option) =>
                      setFieldValue("BrandName", option ? option.value : "")
                    }
                    placeholder="Select Brand"
                    isClearable
                  />
                </div>
                {errors.BrandName && touched.BrandName ? (
                  <p className="errors_msg_p">{errors.BrandName} </p>
                ) : null}
              </div>
              <div className="input_filed_div">
                <label htmlFor="">Model Name </label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="ModelName"
                    value={values.ModelName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.ModelName && touched.ModelName ? (
                  <p className="errors_msg_p">{errors.ModelName} </p>
                ) : null}
              </div>
              <div className="input_filed_div">
                <label htmlFor="">Model Year </label>
                <div className="input_field_box">
                  <input
                    type="number"
                    name="Year"
                    min="2008"
                    max={new Date().getFullYear()}
                    value={values.Year}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onInput={(e) => {
                      if (e.target.value.length > 4) {
                        e.target.value = e.target.value.slice(0, 4);
                      }
                    }}
                  />
                </div>
                {errors.Year && touched.Year ? (
                  <p className="errors_msg_p">{errors.Year} </p>
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
export const EditCarmodalModel = () => {
  const {
    EditCarModelmodel,
    setEditCarModelmodel,
    DeleteCarModelmodel,
    setDeleteCarModelmodel,
    SelectedCarModel,
    setSelectedCarModel,
    reloadCarModelList,
    setreloadCarModelList,
  } = useContext(GlobalContext);

  const handleClose = () => {
    setEditCarModelmodel(false);
  };
  const initialValues = {
    ModelName: "",
    Year: "",
  };

  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const onSubmit = async (values, { resetForm }) => {
    try {
      setloading(true);
      const response = await axios.put(
        "/admin_view/add_car_model",
        {
          name: values.ModelName,
          year: values.Year,
          model_id: SelectedCarModel.id,
        },
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
      setreloadCarModelList(true);
      setloading(false);
      resetForm();
      handleClose();
      setloading(false);
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
      });
      console.log("🚀 ~ onSubmit ~ error:EditCarmodalModel", error);
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
    // validationSchema: CarModelSchemas,
    onSubmit,
    // onSubmit: (values, { resetForm }) => {
    //   console.log(values);
    //   resetForm();
    //   handleClose();
    // },
  });

  useEffect(() => {
    if (SelectedCarModel) {
      setValues({
        ModelName: SelectedCarModel.model,
        Year: SelectedCarModel.year,
      });
    }
  }, [SelectedCarModel, setValues]);
  return (
    <>
      <Modal
        size="md"
        show={EditCarModelmodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Edit Car Model</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <form className="main_div_of_form" onSubmit={handleSubmit}>
              <div className="input_filed_div">
                <label htmlFor="">Model Name </label>
                <div className="input_field_box">
                  <input
                    type="text"
                    name="ModelName"
                    value={values.ModelName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.ModelName && touched.ModelName ? (
                  <p className="errors_msg_p">{errors.ModelName} </p>
                ) : null}
              </div>
              <div className="input_filed_div">
                <label htmlFor="">Model Year </label>
                <div className="input_field_box">
                  <input
                    type="number"
                    name="Year"
                    min="2008"
                    max={new Date().getFullYear()}
                    value={values.Year}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onInput={(e) => {
                      if (e.target.value.length > 4) {
                        e.target.value = e.target.value.slice(0, 4);
                      }
                    }}
                  />
                </div>
                {errors.Year && touched.Year ? (
                  <p className="errors_msg_p">{errors.Year} </p>
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
    </>
  );
};

export const DeleteCarmodalModel = () => {
  const {
    DeleteCarModelmodel,
    setDeleteCarModelmodel,
    SelectedCarModel,
    setSelectedCarModel,
    reloadCarModelList,
    setreloadCarModelList,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setDeleteCarModelmodel(false);
  };
  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const handleDelete = async () => {
    setloading(true);
    try {
      const response = await axios.delete("/admin_view/add_car_model", {
        data: { model_id: SelectedCarModel.id },
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
      setreloadCarModelList(true);
      setSelectedCarModel("");
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
      });
      console.log("🚀 ~ handleDelete ~ error:DeleteCarmodalModel", error);
      setloading(false);
    }
  };
  return (
    <>
      <Modal
        size="md"
        show={DeleteCarModelmodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>
            Delete Car Model
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <p>Are you sure, you want to Delete this Car Model ?</p>

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
