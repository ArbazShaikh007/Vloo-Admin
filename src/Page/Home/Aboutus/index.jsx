import React, { useState, useContext, useEffect, useCallback } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Common/loader";
import { toast, Toaster } from "react-hot-toast";
import axios from "../../../Common/Api/Api";
import Backdrop from "@mui/material/Backdrop";
import { GlobalContext } from "../../../GlobalContext";
import "./Privacy.css";
import { FiShield, FiSave, FiFileText, FiEdit3, FiEye } from "react-icons/fi";

const Aboutus = () => {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState({
    content: "",
    content_ar: "",
    content_bn: "",
  });
  const [wordCounts, setWordCounts] = useState({ en: 0, ar: 0, bn: 0 });

  const navigate = useNavigate();
  const { setEditorPPData } = useContext(GlobalContext);

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const countWords = (html) => {
    const text = (html || "").replace(/<[^>]*>/g, "").trim();
    return text ? text.split(/\s+/).length : 0;
  };

  // ✅ useCallback ensures the function reference is stable
  const getApiData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin_view/update_about_us", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      const data = res?.data?.data || {};
      const next = {
        content: data.content || "",
        content_ar: data.content_ar || "",
        content_bn: data.content_bn || "",
      };

      setApiData(next);
      setEditorPPData(next.content);

      setWordCounts({
        en: countWords(next.content),
        ar: countWords(next.content_ar),
        bn: countWords(next.content_bn),
      });
    } catch (error) {
      toast.error("Failed to load About Us content", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  }, [MyToken, setEditorPPData]); // ✅ dependencies that can change

  // ✅ Now we safely include getApiData
  useEffect(() => {
    getApiData();
  }, [getApiData]);

  const handleEditorChange = (key) => (_evt, editor) => {
    const data = editor.getData();
    setApiData((prev) => ({ ...prev, [key]: data }));
    setWordCounts((prev) => ({
      ...prev,
      [key === "content" ? "en" : key === "content_ar" ? "ar" : "bn"]:
        countWords(data),
    }));
    if (key === "content") setEditorPPData(data);
  };

  const handleSubmit = async () => {
    const { content, content_ar, content_bn } = apiData;

    if (!content.trim() && !content_ar.trim() && !content_bn.trim()) {
      toast.error("Please add content in at least one language.", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/admin_view/update_about_us",
        { content, content_ar, content_bn },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );

      if (response.data?.status === 1) {
        toast.success(response.data.message || "Saved successfully", {
          position: "top-right",
        });
      } else {
        toast.error("Failed to update About Us", { position: "top-right" });
      }
    } catch (error) {
      toast.error("Failed to update About Us", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (key) => {
    const content = apiData[key] || "";
    if (!content.trim()) {
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
          <div className="privacy-header">
            <div className="header-left">
              <div className="header-icon">
                <FiShield size={32} />
              </div>
              <div className="header-content">
                <h1 className="page-title">About Us Editor</h1>
                <p className="page-subtitle">
                  Manage your About Us content in multiple languages.
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

          {/* Editors */}
          <div className="multi-lang-editors">
            {[
              { key: "content", label: "EN", lang: "en" },
              { key: "content_ar", label: "AR", lang: "ar" },
              { key: "content_bn", label: "BN", lang: "bn" },
            ].map(({ key, label, lang }) => (
              <div key={key} className="editor-block">
                <div className="editor-toolbar">
                  <div className="editor-title">
                    <FiEdit3 size={18} />
                    <span>About Us ({label})</span>
                  </div>
                  <button
                    onClick={() => handlePreview(key)}
                    className="toolbar-btn preview-btn"
                    title={`Preview ${label}`}
                  >
                    <FiEye size={16} /> Preview
                  </button>
                </div>
                <CKEditor
                  editor={ClassicEditor}
                  data={apiData[key]}
                  onChange={handleEditorChange(key)}
                  config={{
                    language: lang,
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
                    placeholder:
                      lang === "en"
                        ? "Write the English About Us content..."
                        : lang === "ar"
                        ? "اكتب محتوى من نحن باللغة العربية..."
                        : "বাংলা ভাষায় আমাদের সম্পর্কে লিখুন...",
                  }}
                />
                <div className="word-counter">
                  {wordCounts[lang]} words
                </div>
              </div>
            ))}
          </div>

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

export default Aboutus;
