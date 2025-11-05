import React, { useState, useContext, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Common/loader";
import { toast, Toaster } from "react-hot-toast";
import axios from "../../../Common/Api/Api";
import Backdrop from "@mui/material/Backdrop";
import { GlobalContext } from "../../../GlobalContext";

import "./Privacy.css";
import {
  FiShield,
  FiSave,
  FiEye,
  FiFileText,
  FiEdit3,
} from "react-icons/fi";

const Privacy = () => {
  const [loading, setLoading] = useState(false);
  const [ApiData, setApiData] = useState({
    content: "",
    content_ar: "",
    content_bn: "",
  });
  const [wordCounts, setWordCounts] = useState({ en: 0, ar: 0, bn: 0 });
  const navigate = useNavigate();
  const { editorPPData, setEditorPPData } = useContext(GlobalContext);

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  // ✅ Fetch existing content
  const GetApidata = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin_view/update_privacy", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      setLoading(false);
      const data = res.data?.data || {};
      setApiData({
        content: data.content || "",
        content_ar: data.content_ar || "",
        content_bn: data.content_bn || "",
      });
      setEditorPPData(data.content || "");

      // Initial word counts
      setWordCounts({
        en: countWords(data.content),
        ar: countWords(data.content_ar),
        bn: countWords(data.content_bn),
      });
    } catch (error) {
      console.log("🚀 ~ GetApidata ~ error:", error);
      setLoading(false);
      toast.error("Failed to load privacy policy", { position: "top-right" });
    }
  };

  useEffect(() => {
    GetApidata();
  }, []);

  const countWords = (text) => {
    const plainText = text.replace(/<[^>]*>/g, "").trim();
    return plainText ? plainText.split(/\s+/).length : 0;
  };

  // ✅ Handle editor changes
  const handleEditorChange = (lang, event, editor) => {
    const data = editor.getData();
    setApiData((prev) => ({ ...prev, [lang]: data }));
    setWordCounts((prev) => ({ ...prev, [lang]: countWords(data) }));
  };

  // ✅ Save all content
  const handleSubmit = async () => {
    if (
      !ApiData.content.trim() &&
      !ApiData.content_ar.trim() &&
      !ApiData.content_bn.trim()
    ) {
      toast.error("Please fill at least one language version before saving", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "/admin_view/update_privacy",
        {
          content: ApiData.content,
          content_ar: ApiData.content_ar,
          content_bn: ApiData.content_bn,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );

      setLoading(false);
      if (res.data.status === 1) {
        toast.success("Privacy policy saved successfully", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      setLoading(false);
      toast.error("Failed to update privacy policy", {
        position: "top-right",
      });
    }
  };

  const handlePreview = (lang) => {
    const content = ApiData[lang];
    if (!content) {
      toast.error("No content to preview for this language", {
        position: "top-right",
      });
      return;
    }

    navigate("/Privacy-Policy", { state: { content } });
  };

  return (
    <>
      <Toaster />
      <div className="privacy-container">
        <div className="privacy-wrapper">
          {/* Header Section */}
          <div className="privacy-header">
            <div className="header-left">
              <div className="header-icon">
                <FiShield size={32} />
              </div>
              <div className="header-content">
                <h1 className="page-title">Privacy Policy Editor</h1>
                <p className="page-subtitle">
                  Manage privacy policies in multiple languages
                </p>
              </div>
            </div>

            <div className="header-stats">
              <div className="stat-item">
                <FiFileText className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">
                    {wordCounts.en + wordCounts.ar + wordCounts.bn}
                  </span>
                  <span className="stat-label">Total Words</span>
                </div>
              </div>
            </div>
          </div>

          {/* Three Editors Section */}
          <div className="multi-lang-editors">
            {/* English Editor */}
            <div className="editor-block">
              <div className="editor-toolbar">
                <div className="editor-title">
                  <FiEdit3 size={18} />
                  <span>Privacy Policy (EN)</span>
                </div>
                <button
                  onClick={() => handlePreview("content")}
                  className="toolbar-btn preview-btn"
                  title="Preview English"
                >
                  <FiEye size={16} /> Preview
                </button>
              </div>
              <CKEditor
                editor={ClassicEditor}
                data={ApiData.content}
                onChange={(event, editor) =>
                  handleEditorChange("content", event, editor)
                }
                config={{
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "outdent",
                    "indent",
                    "|",
                    "blockQuote",
                    "insertTable",
                    "|",
                    "link",
                    "|",
                    "undo",
                    "redo",
                  ],
                  placeholder: "Start writing English version...",
                }}
              />
              <div className="word-counter">{wordCounts.en} words</div>
            </div>

            {/* Arabic Editor */}
            <div className="editor-block">
              <div className="editor-toolbar">
                <div className="editor-title">
                  <FiEdit3 size={18} />
                  <span>Privacy Policy (AR)</span>
                </div>
                <button
                  onClick={() => handlePreview("content_ar")}
                  className="toolbar-btn preview-btn"
                  title="Preview Arabic"
                >
                  <FiEye size={16} /> Preview
                </button>
              </div>
              <CKEditor
                editor={ClassicEditor}
                data={ApiData.content_ar}
                onChange={(event, editor) =>
                  handleEditorChange("content_ar", event, editor)
                }
                config={{
                  language: "ar",
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "blockQuote",
                    "link",
                    "|",
                    "undo",
                    "redo",
                  ],
                  placeholder: "اكتب سياسة الخصوصية باللغة العربية...",
                }}
              />
              <div className="word-counter">{wordCounts.ar} words</div>
            </div>

            {/* Bengali Editor */}
            <div className="editor-block">
              <div className="editor-toolbar">
                <div className="editor-title">
                  <FiEdit3 size={18} />
                  <span>Privacy Policy (BN)</span>
                </div>
                <button
                  onClick={() => handlePreview("content_bn")}
                  className="toolbar-btn preview-btn"
                  title="Preview Bengali"
                >
                  <FiEye size={16} /> Preview
                </button>
              </div>
              <CKEditor
                editor={ClassicEditor}
                data={ApiData.content_bn}
                onChange={(event, editor) =>
                  handleEditorChange("content_bn", event, editor)
                }
                config={{
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "blockQuote",
                    "link",
                    "|",
                    "undo",
                    "redo",
                  ],
                  placeholder: "বাংলা সংস্করণ লিখুন...",
                }}
              />
              <div className="word-counter">{wordCounts.bn} words</div>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="footer-save">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div> Saving...
                </>
              ) : (
                <>
                  <FiSave size={18} /> Save All Languages
                </>
              )}
            </button>
          </div>
        </div>
      </div>

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

export default Privacy;
