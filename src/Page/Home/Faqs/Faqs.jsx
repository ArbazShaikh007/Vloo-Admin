import React from "react";
import "./Faqs.css";

import {
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../GlobalContext";
import { Toaster } from "react-hot-toast";
import Loader from "../../../Common/loader/index";
import Backdrop from "@mui/material/Backdrop";
import axios from "../../../Common/Api/Api";

const Faqs = () => {
  const ico = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_10_151)">
        <path
          d="M6.414 16L16.556 5.858L15.142 4.444L5 14.586V16H6.414ZM7.243 18H3V13.757L14.435 2.322C14.6225 2.13453 14.8768 2.02921 15.142 2.02921C15.4072 2.02921 15.6615 2.13453 15.849 2.322L18.678 5.151C18.8655 5.33853 18.9708 5.59284 18.9708 5.858C18.9708 6.12316 18.8655 6.37747 18.678 6.565L7.243 18ZM3 20H21V22H3V20Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_10_151">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const delet = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_10_207)">
        <path
          d="M17 6H22V8H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V8H2V6H7V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H16C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_10_207">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

  const {
    setFaqsAddModel,
    setFaqsDeleteModel,
    setFaqsEditModel,
    setSelectedFaqsData,
    FaqsReload,
    setFaqsReload,
  } = useContext(GlobalContext);

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const [FaqsDataslist, setFaqsDataslist] = useState();

  // Language toggle only (no search)
  const [lang, setLang] = useState("en");
  const textDir = lang === "ar" ? "rtl" : "ltr";

  const FaqsData = async () => {
    setloading(true);
    try {
      const Response = await axios.get("/admin_view/add_faqs", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });
      setFaqsDataslist(Response.data.faq_list);
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };

  useEffect(() => {
    FaqsData();
  }, []);
  useEffect(() => {
    if (FaqsReload === true) {
      FaqsData();
      setFaqsReload(false);
    }
  }, [FaqsReload]);

  const handleEditModel = (row) => {
    setFaqsEditModel(true);
    setSelectedFaqsData(row);
  };
  const handleDeleteModel = (row) => {
    setFaqsDeleteModel(true);
    setSelectedFaqsData(row);
  };

  const pickQuestion = (item) => {
    if (lang === "ar") return item.question_ar || item.question;
    if (lang === "bn") return item.question_bn || item.question;
    return item.question;
  };
  const pickAnswer = (item) => {
    if (lang === "ar") return item.answer_ar || item.answer;
    if (lang === "bn") return item.answer_bn || item.answer;
    return item.answer;
  };

  return (
    <>
      <Toaster />
      <div className="All-Conatinor-perfect-divv">
        <div className="All-Containor-perfect-second-divv">
          <div className="heding_div">
            <div className="addbtn_div">
              <NavLink onClick={setFaqsAddModel} className="secondary_btn">
                Add Faq
              </NavLink>
            </div>

            {/* Only the language buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginLeft: "auto",
              }}
            >
              <button
                type="button"
                className="secondary_btn"
                onClick={() => setLang("en")}
                style={{ padding: "6px 10px", opacity: lang === "en" ? 1 : 0.6 }}
              >
                EN
              </button>
              <button
                type="button"
                className="secondary_btn"
                onClick={() => setLang("ar")}
                style={{ padding: "6px 10px", opacity: lang === "ar" ? 1 : 0.6 }}
              >
                AR
              </button>
              <button
                type="button"
                className="secondary_btn"
                onClick={() => setLang("bn")}
                style={{ padding: "6px 10px", opacity: lang === "bn" ? 1 : 0.6 }}
              >
                BN
              </button>
            </div>
          </div>

          <div className="tabell_bo table_body_user">
            <MDBTable align="middle">
              <MDBTableHead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Question ({lang.toUpperCase()})</th>
                  <th scope="col">Answer ({lang.toUpperCase()})</th>
                  <th scope="col">Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody className="table_body">
                {FaqsDataslist?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No FAQ data available at this time
                    </td>
                  </tr>
                ) : (
                  FaqsDataslist?.map((item, index) => {
                    const q = pickQuestion(item);
                    const a = pickAnswer(item);
                    return (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td style={{ width: "35%" }} dir={textDir}>
                          {q}
                        </td>
                        <td style={{ width: "45%" }} dir={textDir}>
                          {a}
                        </td>
                        <td style={{ width: "20%" }}>
                          <MDBBtn
                            color="dark"
                            rounded
                            size="sm"
                            style={{ marginRight: "1rem" }}
                            onClick={() => handleEditModel(item)}
                          >
                            {ico}
                          </MDBBtn>
                          <MDBBtn
                            style={{ background: "var(--primary-color-lightgreen)" }}
                            rounded
                            size="sm"
                            onClick={() => handleDeleteModel(item)}
                          >
                            {delet}
                          </MDBBtn>
                        </td>
                      </tr>
                    );
                  })
                )}
              </MDBTableBody>
            </MDBTable>
          </div>
        </div>
      </div>

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

export default Faqs;
