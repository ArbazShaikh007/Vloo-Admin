// index_two.jsx
import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "../../../Common/Api/Api";
import { toast } from "react-hot-toast";
import { GlobalContext } from "../../../GlobalContext";
import { Backdrop } from "@mui/material";
import Loader from "../../../Common/loader";

// Make it a NAMED export
export function DeleteSubZoneModel() {
  const {
    DeleteSubZonemodel,
    setDeleteSubZonemodel,
    SelectedZone,
    setSelectedZone,
    setreloadZoneList,
  } = useContext(GlobalContext);

  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const handleClose = () => setDeleteSubZonemodel(false);

  const handleDelete = async () => {
    if (!SelectedZone?.id) {
      toast.error("Invalid sub-zone selected");
      return;
    }
    setloading(true);
    try {
      const res = await axios.delete("/admin_view/add_sub_zone", {
        data: { subzone_id: SelectedZone.id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      toast.success(res?.data?.message || "Sub-zone deleted.", {
        position: "top-right",
      });

      handleClose();
      setreloadZoneList(true);
      setSelectedZone(null);
    } catch (e) {
      toast.error("Failed to delete sub-zone", { position: "top-right" });
    } finally {
      setloading(false);
    }
  };

  const displayName =
    SelectedZone?.subzone_name ||
    SelectedZone?.zone_name ||
    SelectedZone?.name ||
    "this sub-zone";

  return (
    <>
      <Modal
        size="md"
        show={DeleteSubZonemodel}
        onHide={handleClose}
        backdrop="static"
        centered
        style={{ backgroundColor: "#80d7d335" }}
      >
        <Modal.Header closeButton className="model_title">
          <Modal.Title style={{ color: "#004d61" }}>Delete Sub-Zone</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modelbg">
          <p>
            Are you sure you want to delete <strong>{displayName}</strong>?
          </p>
          <div className="btn_of_delte_model">
            <Button variant="secondary" onClick={handleClose}>No</Button>
            <Button
              variant="primary"
              style={{ background: "var(--main-background-color-dark-green)" }}
              onClick={handleDelete}
            >
              Yes
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {loading && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (t) => t.zIndex.drawer + 1,
            backgroundColor: "#004e61ad",
          }}
          open
        >
          <Loader />
        </Backdrop>
      )}
    </>
  );
}

// Also export default so either import style works
export default DeleteSubZoneModel;
