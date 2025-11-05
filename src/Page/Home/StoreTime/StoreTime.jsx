import React, { useContext, useEffect, useState } from "react";
import "./StoreTime.css";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { GlobalContext } from "../../../GlobalContext";
import { NavLink } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import axios from "../../../Common/Api/Api";
import Loader from "../../../Common/loader/index";
import Backdrop from "@mui/material/Backdrop";

const StoreTime = () => {
  const {
    editStoreTimings,
    seteditStoreTimings,
    selectedStoreTimings,
    setselectedStoreTimings,
    reloadStoreTimings,
    setreloadStoreTimings,
  } = useContext(GlobalContext);
  const [loading, setloading] = useState(false);

  const [storeData, setStoreData] = useState([]);
  console.log("🚀 ~ StoreTime ~ storeData:", storeData);
  const Edit = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_10_151)">
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
  const WeekData = [
    { id: "1", name: "Monday", startTime: "04:30 AM", endTime: "05:00 AM" },
    {
      id: "2",
      name: "Tuesday",
      startTime: "01:15 PM",
      endTime: "01:30 PM",
    },
    { id: "3", name: "Wednesday", startTime: "05:15 PM", endTime: "05:30 PM" },
    { id: "4", name: "Thursday", startTime: "08:35 PM", endTime: "08:40 PM" },
    { id: "5", name: "Friday", startTime: "10:00 PM", endTime: "10:15 PM" },
    { id: "6", name: "Saturday ", startTime: "01:00 PM", endTime: "01:15 PM" },
    { id: "7", name: "Sunday", startTime: "02:00 PM", endTime: "02:15 PM" },
  ];
  const handelUpdate = (item) => {
    seteditStoreTimings(true);
    setselectedStoreTimings(item);
  };

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const getSotredata = async () => {
    try {
      setloading(true);
      const response = await axios.get("/admin_view/update_store_data", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });
      console.log("🚀 ~ getSotredata ~ response:", response);

      setStoreData(response?.data?.store_data);

      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };
  useEffect(() => {
    getSotredata();
  }, []);
  useEffect(() => {
    if (reloadStoreTimings === true) {
      getSotredata();
      setreloadStoreTimings(false);
    }
  }, [reloadStoreTimings]);
  return (
    <>
      <div className="All-Conatinor-perfect-divv">
        <div className="All-Containor-perfect-second-divv">
          <div className="heding_div">
            <h1>Store Time</h1>
          </div>
          <div className="tabell_bo table_body_user">
            <MDBTable align="middle table-bordered">
              <MDBTableHead
                style={{
                  background: "var(--main-background-color-dark-green)",
                  color: "#fff",
                }}
              >
                <tr>
                  <th
                    scope="col"
                    style={{ color: "#fff", textAlign: "center" }}
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    style={{ color: "#fff", textAlign: "center" }}
                  >
                    Days
                  </th>
                  <th
                    scope="col"
                    style={{ color: "#fff", textAlign: "center" }}
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    style={{ color: "#fff", textAlign: "center" }}
                  >
                    End Time
                  </th>
                  <th
                    scope="col"
                    style={{ color: "#fff", textAlign: "center" }}
                  >
                    Actions
                  </th>
                </tr>
              </MDBTableHead>
              <MDBTableBody className="table_body ">
                {storeData?.map((item, index) => {
                  return (
                    <tr>
                      <td style={{ textAlign: "center" }}>{index + 1}</td>
                      <td style={{ textAlign: "center" }}>
                        <p className="fw-bold mb-1">{item.day}</p>
                      </td>
                      <td style={{ textAlign: "center" }}>{item.open_time}</td>
                      <td style={{ textAlign: "center" }}>{item.close_time}</td>

                      <td style={{ textAlign: "center" }}>
                        <MDBBtn
                          style={{
                            background:
                              "var(--main-background-color-dark-green)",
                          }}
                          rounded
                          size="sm"
                          onClick={() => handelUpdate(item)}
                        >
                          {/* <CiEdit /> */}
                          {Edit}
                        </MDBBtn>
                      </td>
                    </tr>
                  );
                })}
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

export default StoreTime;
