import React, { useContext, useEffect, useState } from "react";
import "./Extras.css";

import {
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
import { NavLink } from "react-router-dom";
import Loader from "../../../Common/loader/index";
import Backdrop from "@mui/material/Backdrop";
import { GlobalContext } from "../../../GlobalContext";
import axios from "../../../Common/Api/Api";

const Extras = () => {
  const {
    setAddExtrasmodel,
    setEditExtrasmodel,
    setDeleteExtrasmodel,
    setSelectedExtras,
    reloadExtrasList,
    setreloadExtrasList,
  } = useContext(GlobalContext);

  const [loading, setloading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [extrasList, setExtrasList] = useState([]);
  const [meta, setMeta] = useState();

  // language toggle
  const [lang, setLang] = useState("en");

  const searchIcon = (
    <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875Z" fill="#000"/>
    </svg>
  );

  const editIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.414 16L16.556 5.858L15.142 4.444L5 14.586V16H6.414ZM7.243 18H3V13.757L14.435 2.322C14.6225 2.13453 14.8768 2.02921 15.142 2.02921C15.4072 2.02921 15.6615 2.13453 15.849 2.322L18.678 5.151C18.8655 5.33853 18.9708 5.59284 18.9708 5.858C18.9708 6.12316 18.8655 6.37747 18.678 6.565L7.243 18ZM3 20H21V22H3V20Z" fill="white"/>
    </svg>
  );

  const deleteIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 6H22V8H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V8H2V6H7V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H16C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" fill="white"/>
    </svg>
  );

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  const fetchExtras = async (search) => {
    setloading(true);
    try {
      const res = await axios.post(
        "/admin_view/extras_listing",
        { page: activePage, search_text: search },
        { headers: { "Content-Type": "application/json", Authorization: `${MyToken}` } }
      );
      setExtrasList(res.data?.extras_list || []);
      setMeta(res.data);
      setloading(false);
    } catch {
      setloading(false);
    }
  };

  useEffect(() => { fetchExtras(); }, [activePage]);
  useEffect(() => {
    if (reloadExtrasList) { fetchExtras(); setreloadExtrasList(false); }
  }, [reloadExtrasList, setreloadExtrasList]);

  useEffect(() => {
    if (searchTerm.length > 2 || searchTerm.length === 0) {
      const t = setTimeout(() => fetchExtras(searchTerm), 300);
      return () => clearTimeout(t);
    }
  }, [searchTerm]);

  const handlePageClick = (n) => {
    if (n >= 1 && n <= (meta?.pagination_info?.total_pages || 1)) setActivePage(n);
  };

  const renderPaginationItems = () => {
    const total = meta?.pagination_info?.total_pages || 1;
    const limit = 5;
    let start = Math.max(1, activePage - Math.floor(limit / 2));
    let end = Math.min(total, start + limit - 1);
    if (end - start + 1 < limit) start = Math.max(1, end - limit + 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((n) => (
      <MDBPaginationItem key={n} active={n === activePage}>
        <MDBPaginationLink onClick={() => handlePageClick(n)}>{n}</MDBPaginationLink>
      </MDBPaginationItem>
    ));
  };

  const pickName = (it) =>
    lang === "ar" ? it?.name_ar || it?.name :
    lang === "bn" ? it?.name_bn || it?.name :
    it?.name;

  return (
    <>
      <div className="All-Conatinor-perfect-divv">
        <div className="All-Containor-perfect-second-divv">
          {/* Header */}
          <div className="heding_div">
            <div className="addbtn_div">
              <NavLink className="secondary_btn" onClick={setAddExtrasmodel}>
                Add Extras
              </NavLink>
            </div>

            {/* Siblings: language buttons + search pill */}
            <div className="header_actions">
              <div className="lang_toggle">
                <button
                  type="button"
                  className={`secondary_btn ${lang === "en" ? "is-active" : ""}`}
                  onClick={() => setLang("en")}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`secondary_btn ${lang === "ar" ? "is-active" : ""}`}
                  onClick={() => setLang("ar")}
                >
                  AR
                </button>
                <button
                  type="button"
                  className={`secondary_btn ${lang === "bn" ? "is-active" : ""}`}
                  onClick={() => setLang("bn")}
                >
                  BN
                </button>
              </div>

              <div className="search_pill">
                <div className="search_input_box">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <NavLink className="search_icon">{searchIcon}</NavLink>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="tabell_bo table_body_user">
            <MDBTable align="middle">
              <MDBTableHead>
                <tr>
                  <th>No</th>
                  <th>Extras Image</th>
                  <th>Extras Name {lang.toUpperCase()}</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {extrasList.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="poster_img">
                        <img src={item.image} alt="" />
                      </div>
                    </td>
                    <td style={{ width: "30%" }}>
                      <p className="fw-bold mb-1">{pickName(item)}</p>
                    </td>
                    <td>{item.price}</td>
                    <td>
                      <MDBBtn
                        rounded
                        size="sm"
                        style={{ marginRight: "1rem", background: "var(--main-background-color-dark-green)" }}
                        onClick={() => { setEditExtrasmodel(true); setSelectedExtras(item); }}
                      >
                        {editIcon}
                      </MDBBtn>
                      <MDBBtn
                        rounded
                        size="sm"
                        style={{ background: "var(--primary-color-lightgreen)" }}
                        onClick={() => { setDeleteExtrasmodel(true); setSelectedExtras(item); }}
                      >
                        {deleteIcon}
                      </MDBBtn>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </div>

          {/* Pagination */}
          <div className="pagination_div">
            <div className="totoalpage_show_div">
              <p>Total Pages: {meta?.pagination_info?.total_pages}</p>
            </div>
            <nav>
              <MDBPagination className="mb-0">
                <MDBPaginationItem disabled={activePage === 1}>
                  <MDBPaginationLink onClick={() => setActivePage(activePage - 1)}>Previous</MDBPaginationLink>
                </MDBPaginationItem>

                {renderPaginationItems()}

                <MDBPaginationItem disabled={activePage === meta?.pagination_info?.total_pages}>
                  <MDBPaginationLink onClick={() => setActivePage(activePage + 1)}>Next</MDBPaginationLink>
                </MDBPaginationItem>
              </MDBPagination>
            </nav>
          </div>
        </div>
      </div>

      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (t) => t.zIndex.drawer + 1, backgroundColor: "#004e61ad" }}
          open={true}
        >
          <Loader />
        </Backdrop>
      )}
    </>
  );
};

export default Extras;
