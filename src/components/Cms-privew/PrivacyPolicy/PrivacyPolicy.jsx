import React from "react";
import { useLocation } from "react-router-dom";
const PrivacyPolicy = () => {
  const location = useLocation();
  const content = location.state?.content || "";
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Privacy Policy Preview</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default PrivacyPolicy;
