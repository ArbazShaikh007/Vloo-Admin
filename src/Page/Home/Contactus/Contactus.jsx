import React, { useContext, useEffect, useState } from "react";

import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { MDBTooltip } from "mdb-react-ui-kit";
import { GlobalContext } from "../../../GlobalContext";
import { NavLink } from "react-router-dom";
import {
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import axios from "../../../Common/Api/Api";
import Loader from "../../../Common/loader/index";
import Backdrop from "@mui/material/Backdrop";

import { MdDeleteForever } from "react-icons/md";

const Contactus = () => {
  const {
    Supportshow,
    setSupportshow,
    Supportreload,
    setSupportreload,
    Supportdata,
    setSupportdata,

    Supportdelete,
    setSupportdelete,
    cityName,
  } = useContext(GlobalContext);

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
        fill="#fff"
      />
    </svg>
  );
  // const SupportData = [
  //   {
  //     id: 1,
  //     Name: "Ahmed Khan",
  //     Role: "User",
  //     email: "ahmed@example.com",
  //     mobilenumber: "9876543210",
  //     query: "What are the Ramadan prayer timings?",
  //     isReply: true,
  //     centerId: "1",
  //   },
  //   {
  //     id: 2,
  //     Name: "Fatima Ali",
  //     Role: "Provider",
  //     email: "fatima@example.com",
  //     mobilenumber: "9123456780",
  //     query: "How to volunteer for events?",
  //     isReply: false,
  //     centerId: "2",
  //   },
  //   {
  //     id: 3,
  //     Name: "Zaid Patel",
  //     Role: "User",
  //     email: "zaid@example.com",
  //     mobilenumber: "9988776655",
  //     query: "Can I donate via PayPal?",
  //     isReply: true,
  //     centerId: "1",
  //   },
  //   {
  //     id: 4,
  //     Name: "Sara Sheikh",
  //     Role: "Provider",
  //     email: "sara@example.com",
  //     mobilenumber: "8899001122",
  //     query: "Do you provide Quran Support?",
  //     isReply: false,
  //     centerId: "2",
  //   },
  //   {
  //     id: 5,
  //     Name: "Ibrahim Siddiqui",
  //     Role: "User",
  //     email: "ibrahim@example.com",
  //     mobilenumber: "9876123450",
  //     query: "What are the Jummah timings?",
  //     isReply: true,
  //     centerId: "1",
  //   },
  //   {
  //     id: 6,
  //     Name: "Amina Yusuf",
  //     Role: "Provider",
  //     email: "amina@example.com",
  //     mobilenumber: "7788996655",
  //     query: "Do you have youth programs?",
  //     isReply: false,
  //     centerId: "2",
  //   },
  //   {
  //     id: 7,
  //     Name: "Hassan Qureshi",
  //     Role: "User",
  //     email: "hassan@example.com",
  //     mobilenumber: "9900112233",
  //     query: "Can I get a Zakat receipt?",
  //     isReply: true,
  //     centerId: "1",
  //   },
  //   {
  //     id: 8,
  //     Name: "Noor Fatima",
  //     Role: "Provider",
  //     email: "noor@example.com",
  //     mobilenumber: "7654321980",
  //     query: "How do I register for Support?",
  //     isReply: false,
  //     centerId: "2",
  //   },
  //   {
  //     id: 9,
  //     Name: "Yusuf Khan",
  //     Role: "User",
  //     email: "yusuf@example.com",
  //     mobilenumber: "9001122334",
  //     query: "Do you host community events?",
  //     isReply: true,
  //     centerId: "1",
  //   },
  //   {
  //     id: 10,
  //     Name: "Layla Shaikh",
  //     Role: "Provider",
  //     email: "layla@example.com",
  //     mobilenumber: "8192011223",
  //     query: "Can I book a room for a private event?",
  //     isReply: false,
  //     centerId: "2",
  //   },
  // ];

  const reply = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.1 14.6532C17.1 14.6532 15.0975 5.89444 7.19999 5.89444V2.30884L0.899994 8.22454L7.19999 14.2455V10.3242C11.4867 10.3233 14.8644 10.7031 17.1 14.6532Z"
        fill="white"
      />
    </svg>
  );

  const replied = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.25 12.7864C14.25 12.7864 12.8594 6.70387 7.375 6.70387V4.21387L3 8.32199L7.375 12.5032V9.78012C10.3519 9.77949 12.6975 10.0432 14.25 12.7864Z"
        fill="white"
      />
      <path
        d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
        stroke="#FF0000"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3.75 3.75L14.25 14.25"
        stroke="#FF0000"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
    </svg>
  );
  // ! all States
  const [loading, setloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };
  const [activePage, setActivePage] = useState(1);
  const [Pagination, setPagination] = useState();
  const [SupportDataslist, setSupportDataslist] = useState();
  const [SupportDatas, setSupportDatas] = useState();

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  // ! api calling
  const SupportData = async (search) => {
    setloading(true);
    try {
      const Response = await axios.post(
        "/admin_view/admin_contact_us_list",
        { page: activePage, search_text: search },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      console.log("🚀 ~ SupportDataslist ~ Response:", Response);

      setSupportDataslist(Response.data.contact_us_list);
      setSupportDatas(Response.data);
      setloading(false);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      setloading(false);
    }
  };
  useEffect(() => {
    SupportData();
  }, []);
  useEffect(() => {
    SupportData();
  }, [activePage, cityName]);
  useEffect(() => {
    if (Supportreload === true) {
      SupportData();

      setSupportreload(false);
    }
  }, [Supportreload]);
  useEffect(() => {
    if (searchTerm.length > 2 || searchTerm.length === 0) {
      const delayDebounceFn = setTimeout(() => {
        SupportData(searchTerm);
      });

      return () => clearTimeout(delayDebounceFn);
    }
  }, [activePage, searchTerm]);

  const handlePageClick = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= SupportDatas?.pagination_info?.total_pages
    ) {
      setActivePage(pageNumber);
    }
  };

  const renderPaginationItems = () => {
    const totalPages = SupportDatas?.pagination_info?.total_pages || 1;
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

  const handleupdate = (item) => {
    setSupportshow(true);
    setSupportdata(item);
  };
  const handledelete = (item) => {
    setSupportdelete(true);
    setSupportdata(item);
  };
  return (
    <>
      <div className="All-Conatinor-perfect-divv">
        <div className="All-Containor-perfect-second-divv">
          <div className="heding_div">
            <h1>Contact Us</h1>

            <div className="search_main_div">
              <div className="input_box">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
              </div>
              <NavLink>{ico}</NavLink>
            </div>
          </div>
          <div className="tabell_bo table_body_user">
            <MDBTable align="middle">
              <MDBTableHead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Name </th>
                  <th scope="col">Email </th>
                  <th scope="col">Query</th>
                  <th scope="col">Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody className="table_body ">
                {SupportDataslist?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <p className="fw-bold mb-1">{item.username}</p>
                        <p className="mb-1">{item.role}</p>
                      </td>
                      <td>
                        <p className="mb-1">{item.email}</p>
                      </td>
                      <td>{item.description}</td>

                      <td>
                        {item.is_reply ? (
                          <MDBTooltip
                            tag="span"
                            title="Already Replied"
                            placement="top"
                          >
                            <MDBBtn
                              color="dark"
                              rounded
                              size="sm"
                              disabled
                              style={{
                                cursor: "not-allowed",
                                textTransform: "capitalize",
                                fontSize: "14px",
                              }}
                            >
                              {replied}
                            </MDBBtn>
                          </MDBTooltip>
                        ) : (
                          <MDBTooltip
                            tag="span"
                            title="Click to Reply"
                            placement="top"
                          >
                            <MDBBtn
                              style={{
                                background:
                                  "var(--main-background-color-dark-green)",
                                color: "var(--secondary-color-white)",
                              }}
                              rounded
                              size="sm"
                              onClick={() => handleupdate(item)}
                            >
                              {reply}
                            </MDBBtn>
                          </MDBTooltip>
                        )}
                        {/* <MDBTooltip tag="span" title="Delete" placement="top">
                          <MDBBtn
                            style={{
                              background: "var(--primary-color-lightgreen)",
                            }}
                            rounded
                            size="sm"
                            onClick={() => handledelete(item)}
                          >
                            <MdDeleteForever fontSize="18px" />
                          </MDBBtn>
                        </MDBTooltip> */}
                      </td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            </MDBTable>
          </div>
          <div className="pagination_div">
            <div className="totoalpage_show_div">
              <p>Total Pages: {SupportDatas?.pagination_info?.total_pages}</p>
            </div>
            <nav aria-label="Page navigation example">
              <MDBPagination className="mb-0">
                {/* Previous Button */}
                <MDBPaginationItem disabled={activePage === 1}>
                  <MDBPaginationLink
                    onClick={() => handlePageClick(activePage - 1)}
                  >
                    Previous
                  </MDBPaginationLink>
                </MDBPaginationItem>
                {/* Page Numbers (Only 5 are displayed dynamically) */}
                {renderPaginationItems()}
                {/* Next Button */}
                <MDBPaginationItem
                  disabled={
                    activePage === SupportDatas?.pagination_info?.total_pages
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
              backgroundColor: "#1249328c",
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

export default Contactus;
