import React, { useContext, useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import axios from "../../../Common/Api/Api";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { GlobalContext } from "../../../GlobalContext";
import { RiImageAddFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io"; // cross icon
import { Backdrop } from "@mui/material";
import Loader from "../../../Common/loader/index";
export const DeleteZoneModel = () => {
  const {
    DeleteZonemodel,
    setDeleteZonemodel,
    SelectedZone,
    setSelectedZone,
    reloadZoneList,
    setreloadZoneList,
  } = useContext(GlobalContext);
  const handleClose = () => {
    setDeleteZonemodel(false);
  };
  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const handleDelete = async () => {
    setloading(true);
    try {
      const response = await axios.delete("/admin_view/add_zone", {
        data: { zone_id: SelectedZone.id },
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
      setreloadZoneList(true);
      setSelectedZone("");
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      setloading(false);
    }
  };
  return (
    <>
      <Modal
        size="md"
        show={DeleteZonemodel}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Delete Zone</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <div className="main_div_of_model_body">
            <p>Are you sure, you want to Delete this Zone ?</p>

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
