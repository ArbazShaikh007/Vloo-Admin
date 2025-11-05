import React, { useContext, useEffect, useState } from "react";
import "./Brand.css";
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
import { NavLink, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Loader from "../../../Common/loader/index";
import Backdrop from "@mui/material/Backdrop";
import axios from "../../../Common/Api/Api";
import { GlobalContext } from "../../../GlobalContext";

const Brand = () => {
  const {
    setAddBrandmodel,
    setEditBrandmodel,
    setDeleteBrandmodel,
    setSelectedBrand,
    reloadBrandList,
    setreloadBrandList,
  } = useContext(GlobalContext);

  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

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

  const Edit = (
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

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [BrandsDataslist, setBrandsDataslist] = useState();
  const [BrandsDatas, setBrandsDatas] = useState();

  // fetch brand list
  const BrandsData = async (search) => {
    setloading(true);
    try {
      const Response = await axios.post(
        "/admin_view/car_brand_list",
        {
          page: activePage,
          search_text: search,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      setBrandsDataslist(Response.data.car_brand_list);
      setBrandsDatas(Response.data);
      setloading(false);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      setloading(false);
    }
  };

  // initial load
  useEffect(() => {
    BrandsData();
  }, []);

  // pagination change
  useEffect(() => {
    BrandsData();
  }, [activePage]);

  // reload from context
  useEffect(() => {
    if (reloadBrandList === true) {
      BrandsData();
      setreloadBrandList(false);
    }
  }, [reloadBrandList]);

  // search debounce
  useEffect(() => {
    if (searchTerm.length > 2 || searchTerm.length === 0) {
      const delayDebounceFn = setTimeout(() => {
        BrandsData(searchTerm);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [activePage, searchTerm]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handlePageClick = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= BrandsDatas?.pagination_info?.total_pages
    ) {
      setActivePage(pageNumber);
    }
  };

  const renderPaginationItems = () => {
    const totalPages = BrandsDatas?.pagination_info?.total_pages || 1;
    const pageLimit = 5;

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
    setEditBrandmodel(true);
    setSelectedBrand(item);
  };

  const HandleDeletemodel = (item) => {
    setDeleteBrandmodel(true);
    setSelectedBrand(item);
  };

  // NEW: popular toggle
  const handlePopularToggle = async (item) => {
    try {
      setloading(true);
      const res = await axios.post(
        "/admin_view/popular_car_brand",
        { brand_id: item.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );

      if (res.data?.status === 1) {
        toast.success(res.data.message || "Updated successfully");

        // update locally so it reflects instantly
        setBrandsDataslist((prev) =>
          prev?.map((b) =>
            b.id === item.id ? { ...b, is_popular: !b.is_popular } : b
          )
        );
      } else {
        toast.error(res.data?.message || "Something went wrong");
      }
      setloading(false);
    } catch (err) {
      console.log("popular toggle error", err);
      toast.error("Failed to update popular status");
      setloading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="All-Conatinor-perfect-divv">
        <div className="All-Containor-perfect-second-divv">
          <div className="heding_div">
            <div className="addbtn_div">
              <NavLink className="secondary_btn" onClick={setAddBrandmodel}>
                Add Brand
              </NavLink>
            </div>
            <div className="search_main_div">
              <div className="input_box">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder="Search brand..."
                />
              </div>
              <NavLink>{ico}</NavLink>
            </div>
          </div>

          <div className="tabell_bo table_body_user">
            <MDBTable align="middle">
              <MDBTableHead>
                <tr>
                  <th scope="col" style={{ width: "60px" }}>
                    No
                  </th>
                  <th scope="col">Car Brand</th>
                  <th scope="col" style={{ width: "130px" }}>
                    Popular
                  </th>
                  <th scope="col" style={{ width: "160px" }}>
                    Actions
                  </th>
                </tr>
              </MDBTableHead>
              <MDBTableBody className="table_body">
                {BrandsDataslist?.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>

                      {/* POPULAR SWITCH */}
                      <td style={{ textAlign: "left" }}>
                        <label
                          className="switch"
                          title={item.is_popular ? "Popular" : "Make popular"}
                        >
                          <input
                            type="checkbox"
                            checked={item.is_popular}
                            onChange={() => handlePopularToggle(item)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>

                      <td className="actions-td">
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
                      </td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            </MDBTable>
          </div>

          <div className="pagination_div">
            <div className="totoalpage_show_div">
              <p>Total Pages: {BrandsDatas?.pagination_info?.total_pages}</p>
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
                    activePage === BrandsDatas?.pagination_info?.total_pages
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

export default Brand;
