import React, { useContext, useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  AssignSchemas,
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
import Select from "react-select";

export const AssignservicesModel = () => {
  const {
    AddAssignedmodel,
    setAddAssignedmodel,
    EditAssignedmodel,
    setEditAssignedmodel,
    DeleteAssignedmodel,
    setDeleteAssignedmodel,
    SelectedAssigned,
    setSelectedAssigned,
    reloadAssignedList,
    setreloadAssignedList,
    // ✅ read role
    is_subadmin,
  } = useContext(GlobalContext);

  const handleClose = () => {
    setAddAssignedmodel(false);
  };

  const initialValues = {
    ServiceTittle: "", // will hold the id (number) of service
    Zone: "",
    SubZone: "", // used when is_subadmin is true
    Provider: "",
  };
  const [loading, setloading] = useState(false);

  const [ServiceTittleData, setServiceTittleData] = useState();
  const [ZoneData, setZoneData] = useState();
  const [ProviderData, setProviderData] = useState();
  const [SubZoneOptions, setSubZoneOptions] = useState([]);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const Masterdata = async () => {
    try {
      const response = await axios.get("/admin_view/admin_metadata", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });
      setServiceTittleData(is_subadmin ? response.data.service_list : []);
      setZoneData(response.data.zone_list);
      setProviderData(response.data.provider_list);
    } catch (error) {
      console.log("🚀 ~ Masterdata ~ error:", error);
    }
  };

  useEffect(() => {
    if (AddAssignedmodel) Masterdata();
  }, [AddAssignedmodel, is_subadmin]);

  const onSubmit = async (values, { resetForm }) => {
    setloading(true);
    try {
      const payload = {
        provider_id: values.Provider,
        zone_id: values.Zone,
        ...(is_subadmin ? { service_id: values.ServiceTittle } : {}),
        ...(is_subadmin ? { sub_zone_id: values.SubZone } : {}),
      };

      const response = await axios.post("/admin_view/assign_service", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });
      toast.success(response.data.message, { position: "top-right" });
      resetForm();
      handleClose();
      setreloadAssignedList?.(true);
      setloading(false);
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:assign_service", error);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
      });
      setloading(false);
    }
  };

  // ✅ Conditional validation
  const validate = (values) => {
    const errors = {};
    if (!values.Zone) errors.Zone = "Zone is required";
    if (!values.Provider) errors.Provider = "Provider is required";
    if (is_subadmin && !values.ServiceTittle)
      errors.ServiceTittle = "Service is required";
    if (is_subadmin && !values.SubZone)
      errors.SubZone = "Sub Zone is required";
    return errors;
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
    validate,
    onSubmit,
  });

  const ServiceOptions = ServiceTittleData?.map((item) => ({
    value: item.id,
    label: item.service_name,
  }));
  const ZoneOptions = ZoneData?.map((item) => ({
    value: item.id,
    label: item.zone_name,
  }));
  const ProviderOptions = ProviderData?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // ⬇️ derive SubZone list from selected Zone (only when is_subadmin true)
  useEffect(() => {
    if (!is_subadmin) return;
    if (!ZoneData || !values.Zone) {
      setSubZoneOptions([]);
      setFieldValue("SubZone", "");
      return;
    }
    const selectedZone = ZoneData.find(
      (z) => String(z.id) === String(values.Zone)
    );
    const subs = selectedZone?.sub_zone_list || [];
    const mapped = subs.map((s) => {
      // 👇 show sub-zone NAME; your API uses zone_name inside each sub_zone_list item
      const label =
        s.zone_name ??
        s.sub_zone_name ??
        s.name ??
        s.title ??
        s.label ??
        `Sub Zone #${s.id ?? s.sub_zone_id}`;

      return {
        // Keep sending the subzone ID (handles both id or sub_zone_id keys)
        value: s.sub_zone_id ?? s.id,
        label: String(label),
      };
    });
    setSubZoneOptions(mapped);
    if (!mapped.find((m) => String(m.value) === String(values.SubZone))) {
      setFieldValue("SubZone", "");
    }
  }, [is_subadmin, ZoneData, values.Zone]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Modal
        size="md"
        show={AddAssignedmodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>
            Assign Services Model
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <form className="main_div_of_form" onSubmit={handleSubmit}>
              {is_subadmin && (
                <div className="input_filed_div">
                  <label htmlFor="">Services Tittle</label>
                  <div className="brand_filter" style={{ width: "100%" }}>
                    <Select
                      styles={{ width: "100%" }}
                      options={ServiceOptions}
                      value={
                        ServiceOptions?.find(
                          (option) => option.value === values.ServiceTittle
                        ) || null
                      }
                      onChange={(option) =>
                        setFieldValue(
                          "ServiceTittle",
                          option ? option.value : ""
                        )
                      }
                      placeholder="Select Service"
                      isClearable
                    />
                  </div>
                  {errors.ServiceTittle && touched.ServiceTittle ? (
                    <p className="errors_msg_p">{errors.ServiceTittle} </p>
                  ) : null}
                </div>
              )}

              <div className="input_filed_div">
                <label htmlFor="">Zone </label>
                <div className="brand_filter" style={{ width: "100%" }}>
                  <Select
                    styles={{ width: "100%" }}
                    options={ZoneOptions}
                    value={
                      ZoneOptions?.find(
                        (option) => option.value === values.Zone
                      ) || null
                    }
                    onChange={(option) =>
                      setFieldValue("Zone", option ? option.value : "")
                    }
                    placeholder="Select Zone"
                    isClearable
                  />
                </div>
                {errors.Zone && touched.Zone ? (
                  <p className="errors_msg_p">{errors.Zone} </p>
                ) : null}
              </div>

              {is_subadmin && (
                <div className="input_filed_div">
                  <label htmlFor="">Sub Zone</label>
                  <div className="brand_filter" style={{ width: "100%" }}>
                    <Select
                      styles={{ width: "100%" }}
                      options={SubZoneOptions}
                      value={
                        SubZoneOptions?.find(
                          (option) => option.value === values.SubZone
                        ) || null
                      }
                      onChange={(option) =>
                        setFieldValue("SubZone", option ? option.value : "")
                      }
                      placeholder={
                        values.Zone ? "Select Sub Zone" : "Select Zone first"
                      }
                      isDisabled={!values.Zone}
                      isClearable
                    />
                  </div>
                  {errors.SubZone && touched.SubZone ? (
                    <p className="errors_msg_p">{errors.SubZone} </p>
                  ) : null}
                </div>
              )}

              <div className="input_filed_div">
                <label htmlFor="">{is_subadmin ? "Worker" : "Provider"}</label>
                <div className="brand_filter" style={{ width: "100%" }}>
                  <Select
                    styles={{ width: "100%" }}
                    options={ProviderOptions}
                    value={
                      ProviderOptions?.find(
                        (option) => option.value === values.Provider
                      ) || null
                    }
                    onChange={(option) =>
                      setFieldValue("Provider", option ? option.value : "")
                    }
                    placeholder={
                      is_subadmin ? "Select Worker" : "Select Provider"
                    }
                    isClearable
                  />
                </div>
                {errors.Provider && touched.Provider ? (
                  <p className="errors_msg_p">{errors.Provider} </p>
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

export const EditAssignservicesModel = () => {
  const {
    AddAssignedmodel,
    setAddAssignedmodel,
    EditAssignedmodel,
    setEditAssignedmodel,
    DeleteAssignedmodel,
    setDeleteAssignedmodel,
    SelectedAssigned,
    setSelectedAssigned,
    reloadAssignedList,
    setreloadAssignedList,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setEditAssignedmodel(false);
  };
  const initialValues = {
    ServiceTittle: "",
    Zone: "",
    Provider: "",
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
    validationSchema: AssignSchemas,
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      resetForm();
      handleClose();
    },
  });

  const ServiceTittleData = [
    { id: 1, ServiceTittle: "Express Car Wash" },
    { id: 2, ServiceTittle: "Premium Car Wash" },
    { id: 3, ServiceTittle: "Eco-Friendly Wash" },
    { id: 4, ServiceTittle: "Deluxe Car Detailing" },
    { id: 5, ServiceTittle: "Quick Wash Service" },
    { id: 6, ServiceTittle: "Luxury Car Wash" },
    { id: 7, ServiceTittle: "Full Interior Wash" },
    { id: 8, ServiceTittle: "Exterior Shine Wash" },
    { id: 9, ServiceTittle: "Ultimate Car Care" },
    { id: 10, ServiceTittle: "Steam Wash Service" },
  ];
  const ZoneData = [
    { id: 1, Zone: "Olaya District" },
    { id: 2, Zone: "Al Balad" },
    { id: 3, Zone: "Corniche Area" },
    { id: 4, Zone: "Central Area" },
    { id: 5, Zone: "Al Nakheel" },
    { id: 6, Zone: "Al Shifa District" },
    { id: 7, Zone: "King Fahd District" },
    { id: 8, Zone: "Al Barzan" },
    { id: 9, Zone: "Al Faiha" },
    { id: 10, Zone: "Corniche Road" },
  ];
  const ProviderData = [
    { id: 1, Provider: "Ahmed Al-Fahad" },
    { id: 2, Provider: "Omar Al-Saud" },
    { id: 3, Provider: "Khalid Al-Mutairi" },
    { id: 4, Provider: "Fahad Al-Harbi" },
    { id: 5, Provider: "Yousef Al-Shammari" },
    { id: 6, Provider: "Mohammed Al-Qahtani" },
    { id: 7, Provider: "Abdulaziz Al-Dosari" },
    { id: 8, Provider: "Sultan Al-Rashid" },
    { id: 9, Provider: "Hassan Al-Ghamdi" },
    { id: 10, Provider: "Ibrahim Al-Otaibi" },
  ];

  const ServiceOptions = ServiceTittleData?.map((item) => ({
    value: item.id,
    label: item.ServiceTittle,
  }));
  const ZoneOptions = ZoneData?.map((item) => ({
    value: item.id,
    label: item.Zone,
  }));
  const ProviderOptions = ProviderData?.map((item) => ({
    value: item.id,
    label: item.Provider,
  }));

  useEffect(() => {
    if (SelectedAssigned) {
      const service = ServiceOptions.find(
        (opt) => opt.label === SelectedAssigned.ServiceTittle
      );
      const zone = ZoneOptions.find(
        (opt) => opt.label === SelectedAssigned.Zone
      );
      const provider = ProviderOptions.find(
        (opt) => opt.label === SelectedAssigned.Provider
      );

      setValues({
        ServiceTittle: service ? service.value : "",
        Zone: zone ? zone.value : "",
        Provider: provider ? provider.value : "",
      });
    }
  }, [SelectedAssigned, setValues, ServiceOptions, ZoneOptions, ProviderOptions]);

  return (
    <>
      <Modal
        size="md"
        show={EditAssignedmodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>
            Assign Services Model
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <form className="main_div_of_form" onSubmit={handleSubmit}>
              <div className="input_filed_div">
                <label htmlFor="">Services Tittle</label>
                <div className="brand_filter" style={{ width: "100%" }}>
                  <Select
                    styles={{ width: "100%" }}
                    options={ServiceOptions}
                    value={
                      ServiceOptions.find(
                        (option) => option.value === values.ServiceTittle
                      ) || null
                    }
                    onChange={(option) =>
                      setFieldValue(
                        "ServiceTittle",
                        option ? option.value : ""
                      )
                    }
                    placeholder="Select Service"
                    isClearable
                  />
                </div>
                {errors.ServiceTittle && touched.ServiceTittle ? (
                  <p className="errors_msg_p">{errors.ServiceTittle} </p>
                ) : null}
              </div>

              <div className="input_filed_div">
                <label htmlFor="">Zone </label>
                <div className="brand_filter" style={{ width: "100%" }}>
                  <Select
                    styles={{ width: "100%" }}
                    options={ZoneOptions}
                    value={
                      ZoneOptions.find(
                        (option) => option.value === values.Zone
                      ) || null
                    }
                    onChange={(option) =>
                      setFieldValue("Zone", option ? option.value : "")
                    }
                    placeholder="Select Zone"
                    isClearable
                  />
                </div>
                {errors.Zone && touched.Zone ? (
                  <p className="errors_msg_p">{errors.Zone} </p>
                ) : null}
              </div>

              <div className="input_filed_div">
                <label htmlFor="">Provider</label>
                <div className="brand_filter" style={{ width: "100%" }}>
                  <Select
                    styles={{ width: "100%" }}
                    options={ProviderOptions}
                    value={
                      ProviderOptions.find(
                        (option) => option.value === values.Provider
                      ) || null
                    }
                    onChange={(option) =>
                      setFieldValue("Provider", option ? option.value : "")
                    }
                    placeholder="Select Provider"
                    isClearable
                  />
                </div>
                {errors.Provider && touched.Provider ? (
                  <p className="errors_msg_p">{errors.Provider} </p>
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

export const DeleteAssignServicesModel = () => {
  const {
    DeleteAssignedmodel,
    setDeleteAssignedmodel,
    SelectedAssigned,
    setSelectedAssigned,
    reloadAssignedList,
    setreloadAssignedList,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setDeleteAssignedmodel(false);
  };
  return (
    <>
      <Modal
        size="md"
        show={DeleteAssignedmodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>
            Delete Assign Services
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <p>Are you sure, you want to Delete this Assign Services ?</p>

            <div className="btn_of_delte_model">
              <Button variant="secondary" onClick={handleClose}>
                No
              </Button>
              <Button
                variant="primary"
                style={{
                  background: "var(--main-background-color-dark-green)",
                }}
                onClick={handleClose}
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
