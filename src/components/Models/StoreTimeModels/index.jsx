// import React, { useContext, useEffect, useState } from "react";
// import { GlobalContext } from "../../../GlobalContext";
// import Modal from "react-bootstrap/Modal";
// import "./storetime.css";
// import axios from "../../../Common/Api/Api";
// import { useFormik } from "formik";
// import { toast } from "react-hot-toast";
// import { Backdrop } from "@mui/material";
// import Loader from "../../../Common/loader/index";

// import TimePicker from "react-time-picker";
// import "react-time-picker/dist/TimePicker.css";
// import "react-clock/dist/Clock.css";

// export const UpdateStoretimeModel = () => {
//   const {
//     editStoreTimings,
//     seteditStoreTimings,
//     selectedStoreTimings,
//     setselectedStoreTimings,
//     reloadStoreTimings,
//     setreloadStoreTimings,
//   } = useContext(GlobalContext);

//   const [loading, setloading] = useState(false);
//   const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
//   const initialValues = { Starttime: "", endtime: "" };

//   const handleClose = () => {
//     seteditStoreTimings(false);
//   };

//   const onSubmit = async (values, { resetForm }) => {
//     try {
//       setloading(true);
//       const response = await axios.put(
//         "/admin_view/update_store_data",
//         {
//           id: selectedStoreTimings?.id || 1,
//           open_time: values.Starttime,
//           close_time: values.endtime,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `${MyToken}`,
//           },
//         }
//       );
//       toast.success("Update successfully!", { position: "top-right" });
//       setreloadStoreTimings(true);
//       setselectedStoreTimings(null);
//       setloading(false);
//       resetForm();
//       handleClose();
//     } catch (error) {
//       console.log("🚀 ~ onSubmit ~ error:", error);
//       setloading(false);
//     }
//   };

//   const { values, handleSubmit, setFieldValue, setValues } = useFormik({
//     initialValues,
//     onSubmit,
//   });

//   useEffect(() => {
//     if (selectedStoreTimings) {
//       setValues({
//         Starttime: selectedStoreTimings?.open_time || "",
//         endtime: selectedStoreTimings?.close_time || "",
//       });
//     }
//   }, [selectedStoreTimings]);

//   return (
//     <>
//       <Modal
//         show={editStoreTimings}
//         onHide={handleClose}
//         aria-labelledby="contained-modal-title-vcenter"
//         backdrop="static"
//         centered
//         style={{ backgroundColor: "#9fa0a369" }}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title style={{ color: "#004d61" }}>
//             Update Store Time
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <form onSubmit={handleSubmit}>
//             <div className="Time_add_main_div">
//               <label style={{ fontWeight: "bold" }}>
//                 {selectedStoreTimings?.day}
//               </label>

//               <div
//                 className="time_add_main_div"
//                 style={{ display: "flex", gap: "20px", marginTop: "10px" }}
//               >
//                 {/* Start Time */}
//                 <div className="Adhan_div" style={{ flex: 1 }}>
//                   <label style={{ display: "block", marginBottom: "5px" }}>
//                     Start Time
//                   </label>
//                   <TimePicker
//                     onChange={(val) => setFieldValue("Starttime", val)}
//                     value={values.Starttime}
//                     format="HH:mm"
//                     disableClock={true}
//                     // clearIcon={null}
//                   />
//                 </div>

//                 {/* End Time */}
//                 <div className="Iqamah_div" style={{ flex: 1 }}>
//                   <label style={{ display: "block", marginBottom: "5px" }}>
//                     End Time
//                   </label>
//                   <TimePicker
//                     onChange={(val) => setFieldValue("endtime", val)}
//                     value={values.endtime}
//                     format="HH:mm"
//                     disableClock={true}
//                     // clearIcon={null}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div style={{ marginTop: "20px", textAlign: "right" }}>
//               <button type="submit" className="secondary_btn">
//                 Submit
//               </button>
//             </div>
//           </form>
//         </Modal.Body>
//       </Modal>

//       {loading && (
//         <Backdrop
//           sx={{
//             color: "#fff",
//             zIndex: (theme) => theme.zIndex.drawer + 1,
//             backgroundColor: "#004e61ad",
//           }}
//           open={true}
//         >
//           <Loader />
//         </Backdrop>
//       )}
//     </>
//   );
// };

import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../GlobalContext";
import Modal from "react-bootstrap/Modal";
import "./storetime.css";
import axios from "../../../Common/Api/Api";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { Backdrop } from "@mui/material";
import Loader from "../../../Common/loader/index";
import TimeDropdown from "./TimeDropdown";

export const UpdateStoretimeModel = () => {
  const {
    editStoreTimings,
    seteditStoreTimings,
    selectedStoreTimings,
    setselectedStoreTimings,
    reloadStoreTimings,
    setreloadStoreTimings,
  } = useContext(GlobalContext);

  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const initialValues = { Starttime: "09:00", endtime: "18:00" };

  const handleClose = () => {
    seteditStoreTimings(false);
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      setloading(true);
      const response = await axios.put(
        "/admin_view/update_store_data",
        {
          id: selectedStoreTimings?.id || 1,
          open_time: values.Starttime,
          close_time: values.endtime,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      toast.success("Update successfully!", { position: "top-right" });
      setreloadStoreTimings(true);
      setselectedStoreTimings(null);
      setloading(false);
      resetForm();
      handleClose();
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      setloading(false);
    }
  };

  const { values, handleSubmit, setFieldValue, setValues } = useFormik({
    initialValues,
    onSubmit,
  });

  useEffect(() => {
    if (selectedStoreTimings) {
      setValues({
        Starttime: selectedStoreTimings?.open_time || "09:00",
        endtime: selectedStoreTimings?.close_time || "18:00",
      });
    }
  }, [selectedStoreTimings]);

  return (
    <>
      <Modal
        show={editStoreTimings}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#9fa0a369" }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#004d61" }}>
            Update Store Time
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="Time_add_main_div">
              <label style={{ fontWeight: "bold" }}>
                {selectedStoreTimings?.day}
              </label>

              <div
                className="time_add_main_div"
                style={{ display: "flex", gap: "20px", marginTop: "10px" }}
              >
                {/* Start Time */}
                <div className="Adhan_div" style={{ flex: 1 }}>
                  <TimeDropdown
                    label="Start Time"
                    value={values.Starttime}
                    onChange={(val) => setFieldValue("Starttime", val)}
                    name="Starttime"
                  />
                </div>

                {/* End Time */}
                <div className="Iqamah_div" style={{ flex: 1 }}>
                  <TimeDropdown
                    label="End Time"
                    value={values.endtime}
                    onChange={(val) => setFieldValue("endtime", val)}
                    name="endtime"
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button type="submit" className="secondary_btn">
                Submit
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {loading && (
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
      )}
    </>
  );
};
