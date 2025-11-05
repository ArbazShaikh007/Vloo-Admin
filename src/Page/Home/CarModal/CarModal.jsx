import React from "react";
import "./CarModal.css";
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
import Select from "react-select";
import { GlobalContext } from "../../../GlobalContext";
import axios from "../../../Common/Api/Api";
const CarModal = () => {
  const {
    AddCarModelmodel,
    setAddCarModelmodel,
    EditCarModelmodel,
    setEditCarModelmodel,
    DeleteCarModelmodel,
    setDeleteCarModelmodel,
    SelectedCarModel,
    setSelectedCarModel,
    reloadCarModelList,
    setreloadCarModelList,
  } = useContext(GlobalContext);

  const [selectBrand, setSelectBrand] = useState(null);

  const [selectedYear, setSelectedYear] = useState(null);
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

  const [searchTerm, setSearchTerm] = useState("");
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const [activePage, setActivePage] = useState(1);
  const [Pagination, setPagination] = useState();
  const [carModelDataslist, setcarModelDataslist] = useState();
  const [carModelDatas, setcarModelDatas] = useState();

  const [brandName, setbrandName] = useState([]);
  console.log("🚀 ~ brandName:", brandName);
  const getbrand = async () => {
    try {
      const Response = await axios.get(
        "/admin_view/car_brand_list_no_pagination",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      setbrandName(Response.data.car_brand_list);

      console.log("🚀 ~ getbrand ~ Response:", Response);
    } catch (error) {
      console.log("🚀 ~ getbrand ~ error:", error);
    }
  };
  useEffect(() => {
    getbrand();
  }, []);
  // Brand options (value = id, label = name)
  const brandOptions = brandName?.map((car) => ({
    value: car.id,
    label: car.name,
  }));

  // Year options (2001 se current year tak - descending)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 2001 + 1 },
    (_, index) => {
      const year = currentYear - index; // reverse order
      return { value: year, label: year };
    }
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };
  const carModelData = async (search) => {
    setloading(true);
    try {
      const Response = await axios.post(
        "/admin_view/car_models_list",
        {
          page: activePage,
          search_text: search,
          brand_id: selectBrand?.value || "",
          year: selectedYear?.value || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      console.log("🚀 ~ Response:carModelData", Response);
      setcarModelDataslist(Response.data.car_models_list);
      setcarModelDatas(Response.data);
      setloading(false);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      setloading(false);
    }
  };
  useEffect(() => {
    carModelData();
  }, []);
  useEffect(() => {
    carModelData();
  }, [activePage, selectBrand, selectedYear]);
  useEffect(() => {
    if (reloadCarModelList === true) {
      carModelData();
      setreloadCarModelList(false);
    }
  }, [reloadCarModelList]);
  useEffect(() => {
    if (searchTerm.length > 0 || searchTerm.length === 0) {
      const delayDebounceFn = setTimeout(() => {
        carModelData(searchTerm);
      });

      return () => clearTimeout(delayDebounceFn);
    }
  }, [activePage, searchTerm]);
  const handlePageClick = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= carModelDatas?.pagination_info?.total_pages
    ) {
      setActivePage(pageNumber);
    }
  };

  const renderPaginationItems = () => {
    const totalPages = carModelDatas?.pagination_info?.total_pages || 1;
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
    setEditCarModelmodel(true);
    setSelectedCarModel(item);
  };

  const HandleDeletemodel = (item) => {
    setDeleteCarModelmodel(true);
    setSelectedCarModel(item);
  };

  // // Brand options (unique)
  // const brandOptions = [...new Set(brandName?.map((car) => car.name))].map(
  //   (brand) => ({ value: car.id, label: car.name })
  // );

  // // Year options (unique)
  // const yearOptions = [
  //   ...new Set(carModelDataslist?.map((car) => car.year)),
  // ].map((year) => ({ value: year, label: year }));

  // // Filtered data
  // const filteredData = carModelDataslist?.filter((car) => {
  //   return (
  //     (selectBrand ? car.CarBrand === selectBrand.value : true) &&
  //     (selectedYear ? car.year === selectedYear.value : true)
  //   );
  // });
  return (
    <>
      <div className="All-Conatinor-perfect-divv">
        <div className="All-Containor-perfect-second-divv">
          <div className="heding_div">
            <div className="addbtn_div">
              <NavLink className="secondary_btn" onClick={setAddCarModelmodel}>
                Add Brand
              </NavLink>
            </div>
            <div className="heading_inner_div">
              <div className="brand_filter" style={{ width: "200px" }}>
                <Select
                  options={brandOptions}
                  value={selectBrand}
                  onChange={setSelectBrand}
                  placeholder="Select Brand"
                  isClearable
                />
              </div>
              <div className="year_filter" style={{ width: "150px" }}>
                <Select
                  options={yearOptions}
                  value={selectedYear}
                  onChange={setSelectedYear}
                  placeholder="Select Year"
                  isClearable
                />
              </div>
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
          </div>
          <div className="tabell_bo table_body_user">
            <MDBTable align="middle">
              <MDBTableHead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Car Brand</th>
                  <th scope="col">Car Model</th>
                  <th scope="col">Year </th>

                  <th scope="col">Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody className="table_body">
                {carModelDataslist?.map((item, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>

                      <td>{item.brand_name}</td>
                      <td>{item.model}</td>
                      <td>{item.year}</td>

                      <td>
                        {/* <MDBBtn
                             color="dark"
                             rounded
                             size="sm"
                             style={{ marginRight: "1rem" }}
                           >
                             {view}
                           </MDBBtn> */}
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
              <p>Total Pages: {carModelDatas?.pagination_info?.total_pages}</p>
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
                    activePage === carModelDatas?.pagination_info?.total_pages
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

export default CarModal;
