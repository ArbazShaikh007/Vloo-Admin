import React, { useContext, useEffect, useState } from "react";
import "./Zone.css";
import {
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "../../../Common/loader/index";
import Backdrop from "@mui/material/Backdrop";
import { GlobalContext } from "../../../GlobalContext";
import axios from "../../../Common/Api/Api";

const Zone = () => {
  const {
    DeleteZonemodel,
    setDeleteZonemodel,
    SelectedZone,
    setSelectedZone,
    reloadZoneList,
    setreloadZoneList,
    is_subadmin,
  } = useContext(GlobalContext);

  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneDataslist, setzoneDataslist] = useState([]);
  const [zoneDatas, setzoneDatas] = useState();

  const ico = (
    <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875Z"
        fill="#000"
      />
    </svg>
  );

  const delet = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 6H22V8H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V8H2V6H7V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H16C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"
        fill="white"
      />
    </svg>
  );

  const subzone = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 11V6H13V11H18V13H13V18H11V13H6V11H11Z"
        fill="white"
      />
    </svg>
  );

  const HandleDeletemodel = (item) => {
    setDeleteZonemodel(true);
    setSelectedZone(item);
  };

  const handleSubZone = (zone) => {
    navigate(`/Home/SubZones/${zone.id}`, { state: { parentZone: zone } });
  };

  const zoneData = async (search = "") => {
    setloading(true);
    try {
      const endpoint = is_subadmin
        ? "/admin_view/subadmin_zone_list"
        : "/admin_view/zone_list";

      const Response = await axios.post(
        endpoint,
        { page: activePage, keyword: search },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      setzoneDataslist(Response?.data?.zone_list || []);
      setzoneDatas(Response?.data);
    } catch (error) {
      console.log("🚀 ~ error:", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    zoneData();
  }, [is_subadmin]);

  useEffect(() => {
    zoneData(searchTerm);
  }, [activePage]);

  useEffect(() => {
    if (reloadZoneList) {
      zoneData(searchTerm);
      setreloadZoneList(false);
    }
  }, [reloadZoneList]);

  useEffect(() => {
    if (searchTerm.length > 2 || searchTerm.length === 0) {
      const t = setTimeout(() => zoneData(searchTerm), 400);
      return () => clearTimeout(t);
    }
  }, [searchTerm, activePage, is_subadmin]);

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= zoneDatas?.pagination_info?.total_pages) {
      setActivePage(pageNumber);
    }
  };

  const renderPaginationItems = () => {
    const totalPages = zoneDatas?.pagination_info?.total_pages || 1;
    const pageLimit = 5;
    let startPage = Math.max(1, activePage - Math.floor(pageLimit / 2));
    let endPage = Math.min(totalPages, startPage + pageLimit - 1);
    if (endPage - startPage + 1 < pageLimit) {
      startPage = Math.max(1, endPage - pageLimit + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx).map(
      (pageNumber) => (
        <MDBPaginationItem key={pageNumber} active={pageNumber === activePage}>
          <MDBPaginationLink onClick={() => handlePageClick(pageNumber)}>
            {pageNumber}
          </MDBPaginationLink>
        </MDBPaginationItem>
      )
    );
  };

  return (
    <>
      <div className="All-Conatinor-perfect-divv">
        <div className="All-Containor-perfect-second-divv">
          <div className="heding_div">
            <div className="addbtn_div">
              {/* Hide Add Zone for sub-admins */}
              {!is_subadmin && (
                <NavLink to="/Home/AddZone" className="secondary_btn">
                  Add Zone
                </NavLink>
              )}
            </div>
            <div className="search_main_div">
              <div className="input_box">
                <input
                  type="text"
                  placeholder="Search zone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <NavLink>{ico}</NavLink>
            </div>
          </div>

          <div className="tabell_bo table_body_user">
            <MDBTable align="middle">
              <MDBTableHead>
                <tr>
                  <th>No</th>
                  <th>Zone Name</th>
                  <th>Zone Area & City</th>
                  <th>Zone Address</th>
                  <th>Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody className="table_body">
                {zoneDataslist?.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <p className="mb-1">{item.zone_name}</p>
                    </td>
                    <td>
                      <p className="mb-1">{item.zone_area}</p>
                      <p className="mb-1">{item.zone_city}</p>
                    </td>
                    <td>
                      <p className="mb-1">{item.address}</p>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        {/* ✅ Only subadmin sees + button */}
                        {is_subadmin && (
                          <MDBBtn
                            style={{ background: "var(--primary-color-lightgreen)" }}
                            rounded
                            size="sm"
                            onClick={() => handleSubZone(item)}
                          >
                            {subzone}
                          </MDBBtn>
                        )}

                        {/* ✅ Only admin sees Delete button */}
                        {!is_subadmin && (
                          <MDBBtn
                            style={{ background: "var(--primary-color-lightgreen)" }}
                            rounded
                            size="sm"
                            onClick={() => HandleDeletemodel(item)}
                          >
                            {delet}
                          </MDBBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </div>

          <div className="pagination_div">
            <div className="totoalpage_show_div">
              <p>Total Pages: {zoneDatas?.pagination_info?.total_pages}</p>
            </div>
            <nav aria-label="Page navigation example">
              <MDBPagination className="mb-0">
                <MDBPaginationItem disabled={activePage === 1}>
                  <MDBPaginationLink onClick={() => handlePageClick(activePage - 1)}>
                    Previous
                  </MDBPaginationLink>
                </MDBPaginationItem>
                {renderPaginationItems()}
                <MDBPaginationItem
                  disabled={activePage === zoneDatas?.pagination_info?.total_pages}
                >
                  <MDBPaginationLink onClick={() => handlePageClick(activePage + 1)}>
                    Next
                  </MDBPaginationLink>
                </MDBPaginationItem>
              </MDBPagination>
            </nav>
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

export default Zone;
