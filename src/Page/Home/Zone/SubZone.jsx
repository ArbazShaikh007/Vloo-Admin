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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../../../Common/loader";
import Backdrop from "@mui/material/Backdrop";
import { GlobalContext } from "../../../GlobalContext";
import axios from "../../../Common/Api/Api";

const SubZone = () => {
  const {
    setDeleteSubZonemodel,
    setSelectedZone,
    reloadZoneList,
    setreloadZoneList,
  } = useContext(GlobalContext);

  const navigate = useNavigate();
  const location = useLocation();
  const { zoneId: zoneIdFromParams } = useParams();

  // when you arrive here from Zone list, send the parent zone in location.state
  const parentZone = location?.state?.parentZone || null;

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const [loading, setloading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [subZoneList, setSubZoneList] = useState([]);
  const [meta, setMeta] = useState(null);

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

  const fetchSubZones = async (search = "") => {
    setloading(true);
    try {
      const payload = {
        page: activePage,
        zone_id: zoneIdFromParams || (parentZone && parentZone.id) || null,
        keyword: search,
      };

      const res = await axios.post("/admin_view/sub_zone_list", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      if (res?.data?.zone_list) {
        setSubZoneList(res.data.zone_list || []);
        setMeta(res.data.pagination_info || null);
      } else {
        setSubZoneList([]);
        setMeta(null);
      }
    } catch (err) {
      console.error("fetchSubZones error:", err);
      setSubZoneList([]);
      setMeta(null);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchSubZones(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, zoneIdFromParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      setActivePage(1);
      fetchSubZones(searchTerm);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    if (reloadZoneList === true) {
      fetchSubZones();
      setreloadZoneList(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadZoneList]);

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= (meta?.total_pages || 1)) {
      setActivePage(pageNumber);
    }
  };

  const renderPaginationItems = () => {
    const totalPages = meta?.total_pages || 1;
    const pageLimit = 5;
    let startPage = Math.max(1, activePage - Math.floor(pageLimit / 2));
    let endPage = Math.min(totalPages, startPage + pageLimit - 1);
    if (endPage - startPage + 1 < pageLimit) {
      startPage = Math.max(1, endPage - pageLimit + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map(
      (pageNumber) => (
        <MDBPaginationItem key={pageNumber} active={pageNumber === activePage}>
          <MDBPaginationLink onClick={() => handlePageClick(pageNumber)}>
            {pageNumber}
          </MDBPaginationLink>
        </MDBPaginationItem>
      )
    );
  };

  const handleDeleteClick = (item) => {
    setSelectedZone(item);
    setDeleteSubZonemodel(true);
  };

  // navigate to create page (no :zoneId in URL; pass parent via state)
  const handleAddSubZone = () => {
    navigate(`/Home/SubZones/create`, { state: { parentZone } });
  };

  return (
    <>
      <div className="All-Conatinor-perfect-divv">
        <div className="All-Containor-perfect-second-divv">
          <div className="heding_div">
            <div className="addbtn_div">
              <MDBBtn
                className="secondary_btn"
                style={{ backgroundColor: "var(--primary-color-lightgreen)" }}
                onClick={handleAddSubZone}
              >
                + Add SubZone
              </MDBBtn>
            </div>

            <div className="search_main_div" style={{ width: "360px" }}>
              <div className="input_box">
                <input
                  type="text"
                  placeholder="Search sub-zone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>{ico}</div>
            </div>
          </div>

          <div style={{ padding: "8px 12px" }}>
            {parentZone ? (
              <div style={{ fontSize: 14, color: "#0b6b63", marginBottom: 8 }}>
                Parent Zone: <strong>{parentZone.zone_name}</strong> — {parentZone.zone_area} ,{" "}
                {parentZone.zone_city}
              </div>
            ) : (
              <div style={{ fontSize: 14, color: "#333", marginBottom: 8 }}>
                Showing sub-zones (parent zone id: {zoneIdFromParams || "N/A"})
              </div>
            )}
          </div>

          <div className="tabell_bo table_body_user">
            <MDBTable align="middle">
              <MDBTableHead>
                <tr>
                  <th>No</th>
                  <th>Sub-Zone Name</th>
                  <th>Area & City</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </MDBTableHead>

              <MDBTableBody className="table_body">
                {subZoneList?.length > 0 ? (
                  subZoneList.map((item, index) => (
                    <tr key={item.id ?? `${index}-${item.place_id ?? "row"}`}>
                      <td>{((meta?.current_page ?? 1) - 1) * (meta?.page_size ?? 10) + index + 1}</td>
                      <td>{item.subzone_name || item.zone_name || "—"}</td>
                      <td>{[item.zone_area, item.zone_city].filter(Boolean).join(", ") || "—"}</td>
                      <td>{item.address || "—"}</td>
                      <td>
                        <MDBBtn
                          size="sm"
                          color="danger"
                          onClick={() => handleDeleteClick(item)}
                        >
                          {delet}
                        </MDBBtn>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No SubZones Found
                    </td>
                  </tr>
                )}
              </MDBTableBody>
            </MDBTable>
          </div>

          {meta?.total_pages > 1 && (
            <div className="pagination_div">
              <MDBPagination className="mb-0 mt-3 justify-content-center">
                <MDBPaginationItem disabled={activePage === 1}>
                  <MDBPaginationLink onClick={() => handlePageClick(activePage - 1)}>
                    Previous
                  </MDBPaginationLink>
                </MDBPaginationItem>
                {renderPaginationItems()}
                <MDBPaginationItem disabled={activePage === meta?.total_pages}>
                  <MDBPaginationLink onClick={() => handlePageClick(activePage + 1)}>
                    Next
                  </MDBPaginationLink>
                </MDBPaginationItem>
              </MDBPagination>
            </div>
          )}
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

export default SubZone;
