// import React, { useState, useContext, useEffect } from "react";
// import { GlobalContext } from "../../../GlobalContext";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import Button from "react-bootstrap/Button";
// import Loader from "../../../Common/loader";
// import { useNavigate } from "react-router-dom";
// import { toast, Toaster } from "react-hot-toast";
// import axios from "../../../Common/Api/Api";
// import Backdrop from "@mui/material/Backdrop";
// import "./Trems.css";

// const MyEditor = () => {
//   const navigate = useNavigate();
//   const [ApiData, setApiData] = useState();
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [loading, setloading] = useState(false);
//   const { editorTCData, setEditorTCData } = useContext(GlobalContext);
//   const handleEditorChange = (event, editor) => {
//     const data = editor.getData();
//     setEditorTCData(data);
//   };

//   const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
//   // const Tremsdata = async () => {
//   //   setloading(true);
//   //   try {
//   //     const response = await axios.post(
//   //       "admin/terms-condition/add-terms-condition",
//   //       { text: editorTCData },
//   //       {
//   //         headers: {
//   //           Authorization: ` ${MyToken}`,
//   //         },
//   //       }
//   //     );
//   //     console.log("🚀 ~ Tremsdata ~ response:", response);
//   //     setloading(false);
//   //     if (response.data.status === 1) {
//   //       toast.success(response.data.message, {
//   //         position: "top-right",
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.log("🚀 ~ Tremsdata ~ error:", error);
//   //     setloading(false);
//   //   }
//   // };
//   const handleSubmit = () => {
//     // Tremsdata();
//     // setIsSubmitted(true);
//     console.log("Submitted data: ", editorTCData);
//   };
//   // const GetApidata = async () => {
//   //   setloading(true);
//   //   try {
//   //     const res = await axios.get(
//   //       "admin/terms-condition/terms-condition-detail"
//   //     );
//   //     console.log("🚀 ~ Apidata ~ res:", res);
//   //     setloading(false);
//   //     setApiData(res.data.Data.text);
//   //   } catch (error) {
//   //     console.log("🚀 ~ Apidata ~ error:", error);
//   //     setloading(false);
//   //   }
//   // };
//   // useEffect(() => {
//   //   GetApidata();
//   // }, []);

//   return (
//     <>
//       <Toaster />
//       <div className="container">
//         <div className="editor-container">
//           <h2>Terms & Conditions</h2>
//           <CKEditor
//             editor={ClassicEditor}
//             data={ApiData}
//             onReady={(editor) => {
//               console.log("Editor is ready to use!", editor);
//             }}
//             onChange={handleEditorChange}
//             onBlur={(event, editor) => {
//               console.log("Blur.", editor);
//             }}
//             onFocus={(event, editor) => {
//               console.log("Focus.", editor);
//             }}
//           />
//           <div className="btn-container">
//             <Button
//               type="submit"
//               variant="primary"
//               style={{
//                 background: "var(--primary-color-lightgreen)",
//               }}
//               onClick={handleSubmit}>
//               Submit
//             </Button>
//           </div>
//           <div className="preiw_btn">
//             <Button
//               type="button"
//               variant="primary"
//               style={{ background: "var(--primary-color-lightgreen)" }}
//               onClick={() => navigate("/Terms&Conditions")}>
//               Preview
//             </Button>
//           </div>
//         </div>
//       </div>
//       {!loading && <div></div>}
//       {loading && (
//         <div>
//           <Backdrop
//             sx={{
//               color: "#fff",
//               zIndex: (theme) => theme.zIndex.drawer + 1,
//               backgroundColor: "#1249328c",
//             }}
//             open={true}>
//             <Loader />
//           </Backdrop>
//         </div>
//       )}
//     </>
//   );
// };

// export default MyEditor;

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Button from "react-bootstrap/Button";
import "./Trems.css";

const Index = () => {
  return (
    <>
      <div className="container">
        <div className="editor-container">
          <h2>Terms & Conditions</h2>
          <CKEditor
            editor={ClassicEditor}
            data="<p>Hello from CKEditor 5!</p>"
            onReady={(editor) => {
              console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              console.log({ event, editor, data });
            }}
            onBlur={(event, editor) => {
              console.log("Blur.", editor);
            }}
            onFocus={(event, editor) => {
              console.log("Focus.", editor);
            }}
          />
          <div className="btn-container">
            <Button
              type="submit"
              variant="primary"
              style={{
                background: "var(--primary-color-lightgreen)",
              }}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
