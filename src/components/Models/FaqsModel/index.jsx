import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../GlobalContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Faqsmodel.css";
import {
  AddFaqsSchemas, // keeping your existing schema
} from "../../../schemas/index";
import axios from "../../../Common/Api/Api";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import Loader from "../../../Common/loader/index";

/* ========================= ADD ========================= */
export const AddFaqsModel = () => {
  const { FaqsAddModel, setFaqsAddModel, setFaqsReload } =
    useContext(GlobalContext);
  const [loading, setloading] = useState(false);

  const handleClose = () => {
    setFaqsAddModel(false);
  };

  // ✅ include AR & BN fields
  const initialValues = {
    question: "",
    answer: "",
    question_ar: "",
    answer_ar: "",
    question_bn: "",
    answer_bn: "",
  };

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const onSubmit = async (_values, { resetForm }) => {
    setloading(true);
    try {
      const Response = await axios.post(
        "/admin_view/add_faqs",
        {
          question: values.question,
          answer: values.answer,
          question_ar: values.question_ar,
          answer_ar: values.answer_ar,
          question_bn: values.question_bn,
          answer_bn: values.answer_bn,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      toast.success(Response?.data?.message || "FAQ added", {
        position: "top-right",
      });
      resetForm();
      setFaqsReload(true);
      setloading(false);
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add FAQ", {
        position: "top-right",
      });
      setloading(false);
    }
  };

  const {
    values,
    handleBlur,
    handleChange: formikHandleChange,
    touched,
    handleSubmit,
    errors,
  } = useFormik({
    initialValues,
    validationSchema: AddFaqsSchemas, // if this only validates EN, that’s fine
    onSubmit,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    formikHandleChange({ target: { name, value } });
  };

  return (
    <>
      <Modal
        size="md"
        show={FaqsAddModel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "rgba(32, 32, 32, 0.55)" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Add Faqs</Modal.Title>
        </Modal.Header>

        <Modal.Body className="modelbg_hastag">
          <form className="main_hastag_div" onSubmit={handleSubmit}>
            {/* -------- English -------- */}
            <h6 style={{ marginBottom: 8 }}>English (EN)</h6>
            <div className="input_filed_div">
              <label>Add Question (EN)</label>
              <div className="input_field_box">
                <input
                  type="text"
                  name="question"
                  placeholder="Add Question (EN)"
                  value={values.question}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.question && touched.question ? (
                <p className="errors_msg_p">{errors.question}</p>
              ) : null}
            </div>

            <div className="input_filed_div">
              <label>Add Answer (EN)</label>
              <div className="textarea_field_box">
                <textarea
                  name="answer"
                  placeholder="Add Answer (EN)"
                  value={values.answer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.answer && touched.answer ? (
                <p className="errors_msg_p">{errors.answer}</p>
              ) : null}
            </div>

            {/* -------- Arabic -------- */}
            <h6 style={{ marginTop: 20, marginBottom: 8 }}>Arabic (AR)</h6>
            <div className="input_filed_div">
              <label>Question (AR)</label>
              <div className="input_field_box">
                <input
                  type="text"
                  dir="rtl"
                  name="question_ar"
                  placeholder="(AR) أدخل السؤال"
                  value={values.question_ar}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="input_filed_div">
              <label>Answer (AR)</label>
              <div className="textarea_field_box">
                <textarea
                  dir="rtl"
                  name="answer_ar"
                  placeholder="(AR) أدخل الإجابة"
                  value={values.answer_ar}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* -------- Bengali -------- */}
            <h6 style={{ marginTop: 20, marginBottom: 8 }}>Bengali (BN)</h6>
            <div className="input_filed_div">
              <label>Question (BN)</label>
              <div className="input_field_box">
                <input
                  type="text"
                  name="question_bn"
                  placeholder="প্রশ্ন লিখুন (BN)"
                  value={values.question_bn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="input_filed_div">
              <label>Answer (BN)</label>
              <div className="textarea_field_box">
                <textarea
                  name="answer_bn"
                  placeholder="উত্তর লিখুন (BN)"
                  value={values.answer_bn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="btn_of_delte_model">
              <Button
                type="submit"
                variant="primary"
                style={{ background: "var(--primary-color-lightgreen)" }}
              >
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {loading && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "#000000bd",
          }}
          open={true}
        >
          <Loader />
        </Backdrop>
      )}
    </>
  );
};

/* ========================= EDIT ========================= */
export const EditFaqsModel = () => {
  const {
    FaqsEditModel,
    setFaqsEditModel,
    SelectedFaqsData,
    setFaqsReload,
  } = useContext(GlobalContext);
  const [loading, setloading] = useState(false);

  const handleClose = () => {
    setFaqsEditModel(false);
  };

  // ✅ include AR & BN fields
  const initialValues = {
    question: "",
    answer: "",
    question_ar: "",
    answer_ar: "",
    question_bn: "",
    answer_bn: "",
  };

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const onSubmit = async (_value, { resetForm }) => {
    setloading(true);
    try {
      const Response = await axios.put(
        "/admin_view/add_faqs",
        {
          faq_id: SelectedFaqsData?.id,
          question: values.question,
          answer: values.answer,
          question_ar: values.question_ar,
          answer_ar: values.answer_ar,
          question_bn: values.question_bn,
          answer_bn: values.answer_bn,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      toast.success(Response?.data?.message || "FAQ updated", {
        position: "top-right",
      });
      resetForm();
      setFaqsReload(true);
      setloading(false);
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update FAQ", {
        position: "top-right",
      });
      setloading(false);
    }
  };

  const {
    values,
    handleBlur,
    handleChange: formikHandleChange,
    touched,
    handleSubmit,
    errors,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: AddFaqsSchemas, // reuse your schema
    onSubmit,
  });

  useEffect(() => {
    if (SelectedFaqsData) {
      setValues({
        question: SelectedFaqsData?.question || "",
        answer: SelectedFaqsData?.answer || "",
        question_ar: SelectedFaqsData?.question_ar || "",
        answer_ar: SelectedFaqsData?.answer_ar || "",
        question_bn: SelectedFaqsData?.question_bn || "",
        answer_bn: SelectedFaqsData?.answer_bn || "",
      });
    }
  }, [SelectedFaqsData, setValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    formikHandleChange({ target: { name, value } });
  };

  return (
    <>
      <Modal
        size="md"
        show={FaqsEditModel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "rgba(32, 32, 32, 0.55)" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Edit Faqs</Modal.Title>
        </Modal.Header>

        <Modal.Body className="modelbg_hastag">
          <form className="main_hastag_div" onSubmit={handleSubmit}>
            {/* -------- English -------- */}
            <h6 style={{ marginBottom: 8 }}>English (EN)</h6>
            <div className="input_filed_div">
              <label>Edit Question (EN)</label>
              <div className="input_field_box">
                <input
                  type="text"
                  name="question"
                  placeholder="Edit Question (EN)"
                  value={values.question}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.question && touched.question ? (
                <p className="errors_msg_p">{errors.question}</p>
              ) : null}
            </div>

            <div className="input_filed_div">
              <label>Edit Answer (EN)</label>
              <div className="textarea_field_box">
                <textarea
                  name="answer"
                  placeholder="Edit Answer (EN)"
                  value={values.answer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.answer && touched.answer ? (
                <p className="errors_msg_p">{errors.answer}</p>
              ) : null}
            </div>

            {/* -------- Arabic -------- */}
            <h6 style={{ marginTop: 20, marginBottom: 8 }}>Arabic (AR)</h6>
            <div className="input_filed_div">
              <label>Question (AR)</label>
              <div className="input_field_box">
                <input
                  type="text"
                  dir="rtl"
                  name="question_ar"
                  placeholder="(AR) عدّل السؤال"
                  value={values.question_ar}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="input_filed_div">
              <label>Answer (AR)</label>
              <div className="textarea_field_box">
                <textarea
                  dir="rtl"
                  name="answer_ar"
                  placeholder="(AR) عدّل الإجابة"
                  value={values.answer_ar}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* -------- Bengali -------- */}
            <h6 style={{ marginTop: 20, marginBottom: 8 }}>Bengali (BN)</h6>
            <div className="input_filed_div">
              <label>Question (BN)</label>
              <div className="input_field_box">
                <input
                  type="text"
                  name="question_bn"
                  placeholder="প্রশ্ন সংশোধন (BN)"
                  value={values.question_bn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="input_filed_div">
              <label>Answer (BN)</label>
              <div className="textarea_field_box">
                <textarea
                  name="answer_bn"
                  placeholder="উত্তর সংশোধন (BN)"
                  value={values.answer_bn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="btn_of_delte_model">
              <Button
                type="submit"
                variant="primary"
                style={{ background: "var(--primary-color-lightgreen)" }}
              >
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {loading && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "#000000bd",
          }}
          open={true}
        >
          <Loader />
        </Backdrop>
      )}
    </>
  );
};

/* ========================= DELETE (unchanged) ========================= */
export const DeleteFaqsModel = () => {
  const {
    FaqsDeleteModel,
    setFaqsDeleteModel,
    SelectedFaqsData,
    setFaqsReload,
    setSelectedFaqsData,
  } = useContext(GlobalContext);

  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const handleClose = () => {
    setFaqsDeleteModel(false);
  };

  const DeleteFaqsapi = async () => {
    setloading(true);
    try {
      const response = await axios.delete("/admin_view/add_faqs", {
        data: { faq_id: SelectedFaqsData.id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      toast.success(response?.data?.message || "FAQ deleted", {
        position: "top-right",
      });
      setloading(false);
      handleClose();
      setFaqsReload(true);
      setSelectedFaqsData("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete FAQ", {
        position: "top-right",
      });
      setloading(false);
    }
  };

  const handleDeletcall = () => {
    DeleteFaqsapi();
    handleClose();
  };

  return (
    <>
      <Modal
        size="md"
        show={FaqsDeleteModel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "rgba(32, 32, 32, 0.55)" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Delete Faqs</Modal.Title>
        </Modal.Header>
        <Modal.Body closeButton className="modelbg">
          <div className="main_div_of_model_body">
            <p>Are you sure, you want to Delete this Faq ?</p>

            <div className="btn_of_delte_model">
              <Button variant="secondary" onClick={handleClose}>
                No
              </Button>
              <Button
                variant="primary"
                style={{ background: "var(--primary-color-lightgreen)" }}
                onClick={handleDeletcall}
              >
                Yes
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {loading && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "#000000bd",
          }}
          open={true}
        >
          <Loader />
        </Backdrop>
      )}
    </>
  );
};
