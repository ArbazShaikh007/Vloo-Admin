import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../GlobalContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "../../../Common/Api/Api";
import { setNestedObjectValues, useFormik } from "formik";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SupportsSchemas } from "../../../schemas";

import { Backdrop } from "@mui/material";
import Loader from "../../../Common/loader/index";

export const SupportReplyModel = () => {
  const {
    Supportshow,
    setSupportshow,
    Supportreload,
    setSupportreload,
    Supportdata,
    setSupportdata,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setSupportshow(false);
  };
  const initialValues = {
    reply: "",
  };
  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const onSubmit = async (values, { resetForm }) => {
    setloading(true);
    try {
      const Response = await axios.post(
        "/admin_view/contact_us_reply",
        { id: Supportdata.id, reply: values.reply },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      console.log("🚀 ~ onSubmit ~ Response:", Response);
      setloading(false);
      resetForm();
      handleClose();
      setSupportdata();
      setSupportreload(true);
      toast.success(Response.data.message, {
        position: "top-right",
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
      });
      console.log("🚀 ~ onSubmit ~ error:", error);
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
    validationSchema: SupportsSchemas,
    onSubmit,
    // onSubmit: (values, { resetForm }) => {
    //   console.log("Submitted Values:", values);
    //   resetForm();
    //   toast.success("Reply send successfully!");
    //   handleClose();
    // },
  });
  return (
    <>
      <Modal
        size="md"
        show={Supportshow}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#9fa0a369" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reply</Modal.Title>
        </Modal.Header>
        <Modal.Body closeButton className="modelbg">
          <form
            action=""
            className="model_Events_body_main_div"
            onSubmit={handleSubmit}
          >
            <div className="input_filed_div">
              <label htmlFor="">Reply </label>
              <div className="textarea_field_box">
                <textarea
                  name="reply"
                  value={values.reply}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id=""
                ></textarea>
              </div>
              {errors.reply && touched.reply ? (
                <p className="errors_msg_p">{errors.reply} </p>
              ) : null}
            </div>
            <button type="submit" className="secondary_btn">
              Submit
            </button>
          </form>
        </Modal.Body>
      </Modal>
      {!loading && <div></div>}
      {loading && (
        <div>
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "#1249328c",
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
export const DeleteSupportModel = () => {
  const {
    Supportreload,
    setSupportreload,
    Supportdata,
    setSupportdata,
    Supportdelete,
    setSupportdelete,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setSupportdelete(false);
  };
  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const handleDelete = async () => {
    setloading(true);
    try {
      const Response = await axios.post(
        "admin/delete-contactus",
        { cotactUsId: Supportdata.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      handleClose();
      setSupportreload(true);
      setloading(false);
      setSupportdata("");
      toast.success(Response.data.message, {
        position: "top-right",
      });
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      toast.error(error.response.data.message, {
        position: "top-right",
      });
      setloading(false);
    }
  };
  return (
    <>
      <Modal
        size="sm"
        show={Supportdelete}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#9fa0a369" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body closeButton className="modelbg">
          <p style={{ textAlign: "center" }}>
            Are you sure, you want to delete this Details?
          </p>

          <div className="btn_of_delte_model">
            <Button variant="secondary" onClick={handleClose}>
              Closed
            </Button>
            <Button
              variant="primary"
              style={{ background: "var(--primary-color-lightgreen)" }}
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
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
              backgroundColor: "#1249328c",
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
