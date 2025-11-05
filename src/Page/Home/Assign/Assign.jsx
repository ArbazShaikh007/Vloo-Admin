import React from "react";

import "./Assign.css";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import {
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Loader from "../../../Common/loader/index";
import Backdrop from "@mui/material/Backdrop";
import axios from "../../../Common/Api/Api";
import { GlobalContext } from "../../../GlobalContext";
const Assign = () => {
  const {
    AddAssignedmodel,
    setAddAssignedmodel,
    EditAssignedmodel,
    setEditAssignedmodel,
    DeleteAssignedmodel,
    setDeleteAssignedmodel,
    SelectedAssigned,
    setSelectedAssigned,
    reloadAssignedList,
    setreloadAssignedList,
    // ⬇️ added: use is_subadmin from context (used only for button label)
    is_subadmin,
  } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };
  const ico = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875Z"
        fill="#000"
      />
    </svg>
  );
  const view = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.445 9.03C16.105 3.323 7.895 3.323 4.555 9.03C4.02801 9.93107 3.75027 10.9561 3.75027 12C3.75027 13.0439 4.02801 14.0689 4.555 14.97C7.895 20.677 16.105 20.677 19.445 14.97C19.972 14.0689 20.2497 13.0439 20.2497 12C20.2497 10.9561 19.972 9.93107 19.445 9.03ZM3.26 8.272C7.18 1.576 16.82 1.576 20.74 8.272C21.4016 9.40299 21.7503 10.6897 21.7503 12C21.7503 13.3103 21.4016 14.597 20.74 15.728C16.82 22.424 7.18 22.424 3.26 15.728C2.59837 14.597 2.24965 13.3103 2.24965 12C2.24965 10.6897 2.59837 9.40299 3.26 8.272ZM12 9.197C10.46 9.197 9.193 10.467 9.193 12.061C9.193 13.653 10.461 14.923 11.999 14.923C13.539 14.923 14.807 13.653 14.807 12.061C14.807 10.467 13.539 9.197 11.999 9.197H12ZM7.693 12.061C7.693 9.661 9.61 7.697 11.999 7.697C14.389 7.697 16.307 9.661 16.307 12.061C16.307 14.46 14.389 16.423 11.999 16.423C9.609 16.423 7.693 14.459 7.693 12.061Z"
        fill="white"
      />
    </svg>
  );
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
  const delet = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_10_207)">
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

  const AssignedData = [
    {
      id: 1,
      ServiceTittle: "Express Car Wash",
      Zone: "Olaya District",
      City: "Riyadh",
      Provider: "Ahmed Al-Fahad",
    },
    {
      id: 2,
      ServiceTittle: "Premium Car Wash",
      Zone: "Al Balad",
      City: "Jeddah",
      Provider: "Omar Al-Saud",
    },
    {
      id: 3,
      ServiceTittle: "Eco-Friendly Wash",
      Zone: "Corniche Area",
      City: "Dammam",
      Provider: "Khalid Al-Mutairi",
    },
    {
      id: 4,
      ServiceTittle: "Deluxe Car Detailing",
      Zone: "Central Area",
      City: "Madinah",
      Provider: "Fahad Al-Harbi",
    },
    {
      id: 5,
      ServiceTittle: "Quick Wash Service",
      Zone: "Al Nakheel",
      City: "Buraidah",
      Provider: "Yousef Al-Shammari",
    },
    {
      id: 6,
      ServiceTittle: "Luxury Car Wash",
      Zone: "Al Shifa District",
      City: "Abha",
      Provider: "Mohammed Al-Qahtani",
    },
    {
      id: 7,
      ServiceTittle: "Full Interior Wash",
      Zone: "King Fahd District",
      City: "Tabuk",
      Provider: "Abdulaziz Al-Dosari",
    },
    {
      id: 8,
      ServiceTittle: "Exterior Shine Wash",
      Zone: "Al Barzan",
      City: "Hail",
      Provider: "Sultan Al-Rashid",
    },
    {
      id: 9,
      ServiceTittle: "Ultimate Car Care",
      Zone: "Al Faiha",
      City: "Najran",
      Provider: "Hassan Al-Ghamdi",
    },
    {
      id: 10,
      ServiceTittle: "Steam Wash Service",
      Zone: "Corniche Road",
      City: "Jazan",
      Provider: "Ibrahim Al-Otaibi",
    },
  ];

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const [activePage, setActivePage] = useState(1);
  const [Pagination, setPagination] = useState();
  const [AssignDataslist, setAssignDataslist] = useState();
  const [AssignDatas, setAssignDatas] = useState();

  const AssignData = async (search) => {
    setloading(true);
    try {
      const Response = await axios.post(
        "/admin_view/assigned_provider_list",
        {
          page: activePage,
          // search_text: search,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      console.log("🚀 ~ Response:AssignData", Response);
      setAssignDataslist(Response.data.assigend_list);
      setAssignDatas(Response.data);
      setloading(false);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      setloading(false);
    }
  };
  useEffect(() => {
    AssignData();
  }, []);
  useEffect(() => {
    AssignData();
  }, [activePage]);
  useEffect(() => {
    if (reloadAssignedList === true) {
      AssignData();
      setreloadAssignedList(false);
    }
  }, [reloadAssignedList]);

  const handlePageClick = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= AssignDatas?.pagination_info?.total_pages
    ) {
      setActivePage(pageNumber);
    }
  };

  const renderPaginationItems = () => {
    const totalPages = AssignDatas?.pagination_info?.total_pages || 1;
    const pageLimit = 5; // Show only 5 numbers

    let startPage = Math.max(1, activePage - Math.floor(pageLimit / 2));
    let endPage = Math.min(totalPages, startPage + pageLimit - 1);

    if (endPage - startPage + 1 < pageLimit) {
      startPage = Math.max(1, endPage - pageLimit + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    ).map((pageNumber) => (
      <MDBPaginationItem key={pageNumber} active={pageNumber === activePage}>
        <MDBPaginationLink onClick={() => handlePageClick(pageNumber)}>
          {pageNumber}
        </MDBPaginationLink>
      </MDBPaginationItem>
    ));
  };

  const HandleEditmodel = (item) => {
    setEditAssignedmodel(true);
    setSelectedAssigned(item);
  };

  const HandleDeletemodel = (item) => {
    setDeleteAssignedmodel(true);
    setSelectedAssigned(item);
  };

  return (
    <>
      <div className="All-Conatinor-perfect-divv">
        <div className="All-Containor-perfect-second-divv">
          <div className="heding_div">
            <div className="addbtn_div">
              {/* ✅ only text changed based on is_subadmin; rest untouched */}
              <NavLink onClick={setAddAssignedmodel} className="secondary_btn">
                {is_subadmin ? "Assign Services" : "Assign Zone"}
              </NavLink>
            </div>
            {/* <div className="search_main_div">
              <div className="input_box">
                <input
                  type="text"
                  //   value={searchTerm}
                  //   onChange={handleInputChange}
                />
              </div>
              <NavLink>{ico}</NavLink>
            </div> */}
          </div>
          <div className="tabell_bo table_body_user">
            <MDBTable align="middle">
              <MDBTableHead>
                <tr>
                  <th scope="col">No</th>
                  {/* ✅ show Services column only for subadmin */}
                  {is_subadmin && <th scope="col">Services</th>}
                  <th scope="col">Zone</th>
                  <th scope="col">Provider</th>

                  {/* <th scope="col">Actions</th> */}
                </tr>
              </MDBTableHead>
              <MDBTableBody className="table_body">
                {AssignDataslist?.map((item, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>

                      {/* ✅ show service cell only for subadmin */}
                      {is_subadmin && (
                        <td>
                          <p className="fw-bold mb-1">{item.service_name}</p>
                        </td>
                      )}
                      <td>
                        <p className="fw-bold mb-1">{item.zone_name}</p>
                      </td>
                      <td>
                        <p className="fw-bold mb-1">{item.name}</p>
                      </td>
                      {/* 
                      <td>
                        <MDBBtn
                          color="dark"
                          rounded
                          size="sm"
                          style={{ marginRight: "1rem" }}
                        >
                          {view}
                        </MDBBtn>
                        <MDBBtn
                          rounded
                          size="sm"
                          style={{
                            marginRight: "1rem",
                            background:
                              "var(--main-background-color-dark-green)",
                          }}
                          onClick={() => HandleEditmodel(item)}
                        >
                          {Edit}
                        </MDBBtn>
                        <MDBBtn
                          style={{
                            background: "var(--primary-color-lightgreen)",
                          }}
                          rounded
                          size="sm"
                          onClick={() => HandleDeletemodel(item)}
                        >
                          {delet}
                        </MDBBtn>
                      </td> */}
                    </tr>
                  );
                })}
              </MDBTableBody>
            </MDBTable>
          </div>
          <div className="pagination_div">
            <div className="totoalpage_show_div">
              <p>Total Pages: {AssignDatas?.pagination_info?.total_pages}</p>
            </div>
            <nav aria-label="Page navigation example">
              <MDBPagination className="mb-0">
                <MDBPaginationItem disabled={activePage === 1}>
                  <MDBPaginationLink
                    onClick={() => handlePageClick(activePage - 1)}
                  >
                    Previous
                  </MDBPaginationLink>
                </MDBPaginationItem>

                {renderPaginationItems()}

                <MDBPaginationItem
                  disabled={
                    activePage === AssignDatas?.pagination_info?.total_pages
                  }
                >
                  <MDBPaginationLink
                    onClick={() => handlePageClick(activePage + 1)}
                  >
                    Next
                  </MDBPaginationLink>
                </MDBPaginationItem>
              </MDBPagination>
            </nav>
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

export default Assign;
