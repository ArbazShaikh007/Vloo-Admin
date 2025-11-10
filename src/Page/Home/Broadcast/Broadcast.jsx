import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Common/loader";
import { toast, Toaster } from "react-hot-toast";
import axios from "../../../Common/Api/Api";
import Backdrop from "@mui/material/Backdrop";
import { GlobalContext } from "../../../GlobalContext";
import "./Broadcast.css";
import {
  FiShield,
  FiSave,
  FiFileText,
  FiEdit3,
  FiEye,
} from "react-icons/fi";

const Broadcast = () => {
  const navigate = useNavigate();
  const global = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [messageEn, setMessageEn] = useState("");
  const [messageAr, setMessageAr] = useState("");
  const [messageBn, setMessageBn] = useState("");

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin_view/user_no_pagination_list", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      if (res?.data?.status === 1 && Array.isArray(res.data.user_list)) {
        setUsers(res.data.user_list);
      } else {
        toast.error(res?.data?.message || "Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Something went wrong while loading users");
    } finally {
      setLoading(false);
    }
  }, [MyToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleUserSelection = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id)
        ? prev.filter((uid) => uid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUserIds([]);
      setSelectAll(false);
    } else {
      const allIds = users.map((u) => u.id);
      setSelectedUserIds(allIds);
      setSelectAll(true);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.mobile && u.mobile.toLowerCase().includes(q))
    );
  });

  const validate = () => {
    if (!messageEn.trim()) {
      toast.error("Message in English is required");
      return false;
    }
    if (!messageAr.trim()) {
      toast.error("Message in Arabic is required");
      return false;
    }
    if (!messageBn.trim()) {
      toast.error("Message in Bangladeshi is required");
      return false;
    }
    if (!selectedUserIds.length) {
      toast.error("Please select at least one user");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload = {
        message_en: messageEn,
        message_ar: messageAr,
        message_bn: messageBn,
        user_id: selectedUserIds.join(","),
      };

      const res = await axios.post(
        "/admin_view/broadcast_message",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );

      if (res?.data?.status === 1) {
        toast.success(
          res.data.message || "Broadcast message successfully sent"
        );
        setMessageEn("");
        setMessageAr("");
        setMessageBn("");
        setSelectedUserIds([]);
        setSelectAll(false);
      } else {
        toast.error(res?.data?.message || "Failed to send broadcast");
      }
    } catch (error) {
      console.error("Broadcast error:", error);
      toast.error("Something went wrong while sending broadcast");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />

      {(loading || submitting) && (
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

      <div className="broadcast-page">
        <div className="broadcast-header">
          <div className="broadcast-title-wrap">
            <FiShield className="broadcast-header-icon" />
            <div>
              <h2 className="broadcast-title">Broadcast Message</h2>
              <p className="broadcast-subtitle">
                Send announcements to one or multiple users instantly.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="broadcast-back-btn"
            onClick={() => navigate(-1)}
          >
            <FiEye size={16} />
            <span>Back</span>
          </button>
        </div>

        <form className="broadcast-form" onSubmit={handleSubmit}>
          <div className="broadcast-card">
            <div className="broadcast-card-header">
              <FiFileText className="broadcast-card-icon" />
              <h3>Message Content</h3>
            </div>

            <div className="broadcast-field">
              <label>
                English Message <span className="required">*</span>
              </label>
              <div className="broadcast-ckeditor-wrap">
                <textarea
                  className="broadcast-textarea"
                  rows={3}
                  value={messageEn}
                  onChange={(e) => setMessageEn(e.target.value)}
                  placeholder="Write message in English..."
                />
              </div>
            </div>

            <div className="broadcast-field">
              <label>
                Arabic Message <span className="required">*</span>
              </label>
              <div className="broadcast-ckeditor-wrap">
                <textarea
                  dir="rtl"
                  className="broadcast-textarea"
                  rows={3}
                  value={messageAr}
                  onChange={(e) => setMessageAr(e.target.value)}
                  placeholder="Write message in Arabic..."
                />
              </div>
            </div>

            <div className="broadcast-field">
              <label>
                Bangladeshi Message <span className="required">*</span>
              </label>
              <div className="broadcast-ckeditor-wrap">
                <textarea
                  className="broadcast-textarea"
                  rows={3}
                  value={messageBn}
                  onChange={(e) => setMessageBn(e.target.value)}
                  placeholder="Write message in Bangla..."
                />
              </div>
            </div>
          </div>

          <div className="broadcast-card">
            <div className="broadcast-card-header">
              <FiEdit3 className="broadcast-card-icon" />
              <h3>Select Users</h3>
            </div>

            <div className="broadcast-users-header">
              <div className="broadcast-users-summary">
                <span>
                  Total Users: <strong>{users.length}</strong>
                </span>
                <span>
                  Selected: <strong>{selectedUserIds.length}</strong>
                </span>
              </div>

              <div className="broadcast-users-actions">
                <label className="select-all-label">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <span>Select All</span>
                </label>

                <input
                  type="text"
                  className="broadcast-search-input"
                  placeholder="Search by name, email, or mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="broadcast-users-list">
              {filteredUsers.length === 0 ? (
                <div className="broadcast-no-users">No users found.</div>
              ) : (
                filteredUsers.map((user) => {
                  const isChecked = selectedUserIds.includes(user.id);
                  return (
                    <label
                      key={user.id}
                      className={`broadcast-user-item ${
                        isChecked ? "selected" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleUserSelection(user.id)}
                      />
                      <div className="broadcast-user-info">
                        <div className="broadcast-user-name">
                          {user.name || "No Name"}
                        </div>
                        <div className="broadcast-user-meta">
                          {user.email && <span>{user.email}</span>}
                          {user.mobile && (
                            <span>
                              {user.countryCode
                                ? `+${user.countryCode} `
                                : ""}
                              {user.mobile}
                            </span>
                          )}
                          {user.role && (
                            <span className="role-pill">{user.role}</span>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div className="broadcast-submit-wrap">
            <button
              type="submit"
              className="broadcast-submit-btn"
              disabled={submitting}
            >
              <FiSave size={18} />
              <span>
                {submitting ? "Sending..." : "Send Broadcast Message"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Broadcast;
