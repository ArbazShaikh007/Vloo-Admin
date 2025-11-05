import React, { useContext, useEffect, useState } from "react";
import "./Baneer.css";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Loader from "../../../Common/loader/index";
import Backdrop from "@mui/material/Backdrop";
import axios from "../../../Common/Api/Api";
import { GlobalContext } from "../../../GlobalContext";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { IoToggle } from "react-icons/io5";
import { IoToggleOutline } from "react-icons/io5";

const Banner = () => {
  const {
    AddBannermodel,
    setAddBannermodel,
    EditBannermodel,
    setEditBannermodel,
    DeleteBannermodel,
    setDeleteBannermodel,
    SelectedBanner,
    setSelectedBanner,
    reloadBannerList,
    setreloadBannerList,
  } = useContext(GlobalContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const [activePage, setActivePage] = useState(1);

  const [BannerDataslist, setBannerDataslist] = useState([]);
  const [BannerDatas, setBannerDatas] = useState();

  const BannerData = async (search) => {
    setLoading(true);
    try {
      const Response = await axios.post(
        "/admin_view/banner_list",
        {
          page: activePage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      setBannerDataslist(Response.data.banner_list);
      setBannerDatas(Response.data);
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    BannerData();
  }, []);

  useEffect(() => {
    BannerData();
  }, [activePage]);

  useEffect(() => {
    if (reloadBannerList === true) {
      BannerData();
      setreloadBannerList(false);
    }
  }, [reloadBannerList]);

  const handlePageClick = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= BannerDatas?.pagination_info?.total_pages
    ) {
      setActivePage(pageNumber);
    }
  };

  const renderPaginationItems = () => {
    const totalPages = BannerDatas?.pagination_info?.total_pages || 1;
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
      <button
        key={pageNumber}
        className={`pagination-btn ${
          pageNumber === activePage ? "active" : ""
        }`}
        onClick={() => handlePageClick(pageNumber)}
      >
        {pageNumber}
      </button>
    ));
  };

  const HandleEditmodel = (item) => {
    setEditBannermodel(true);
    setSelectedBanner(item);
  };

  const HandleDeletemodel = (item) => {
    setDeleteBannermodel(true);
    setSelectedBanner(item);
  };

  const handelStatuschange = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "/admin_view/banner_status_change",
        { banner_id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      toast.success(res?.data.message, {
        position: "top-right",
      });
      setreloadBannerList(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="banner-container">
        <div className="banner-header">
          <div className="header-left">
            <h1 className="page-title">Banner Management</h1>
            <p className="page-subtitle">Manage your promotional banners</p>
          </div>

          <div className="header-actions">
            <button onClick={() => setAddBannermodel(true)} className="add-btn">
              <FiPlus size={20} />
              Add Banner
            </button>
          </div>
        </div>

        {BannerDataslist?.length > 0 ? (
          <>
            <div className="banner-grid">
              {BannerDataslist.map((item, index) => (
                <div key={index} className="banner-card">
                  <div className="banner-image-container">
                    <img
                      src={item.banner_image}
                      alt={`Banner ${index + 1}`}
                      className="banner-image"
                    />
                    <div className="image-overlay-Banner">
                      <button
                        className="overlay-btn view-btn"
                        onClick={() => window.open(item.banner_image, "_blank")}
                        title="View Full Size"
                      >
                        <FiEye size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="banner-actions">
                    <div className="action-group">
                      <button
                        onClick={() => HandleEditmodel(item)}
                        className="action-btn edit-btn"
                        title="Edit Banner"
                      >
                        <FiEdit2 size={16} />
                      </button>

                      <button
                        onClick={() => HandleDeletemodel(item)}
                        className="action-btn delete-btn"
                        title="Delete Banner"
                      >
                        <FiTrash2 size={16} />
                      </button>

                      <button
                        onClick={() => handelStatuschange(item.id)}
                        className={`action-btn toggle-btn ${
                          item.is_active ? "active" : "inactive"
                        }`}
                        title={
                          item.is_active
                            ? "Deactivate Banner"
                            : "Activate Banner"
                        }
                      >
                        {item.is_active ? (
                          <IoToggle size={20} />
                        ) : (
                          <IoToggleOutline size={20} />
                        )}
                      </button>
                    </div>

                    <div className="status-indicator">
                      <div
                        className={`status-dot ${
                          item.is_active ? "active" : "inactive"
                        }`}
                      ></div>
                      <span className="status-text">
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {BannerDatas?.pagination_info?.total_pages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  <span>
                    Page {activePage} of{" "}
                    {BannerDatas?.pagination_info?.total_pages}
                  </span>
                  <span>
                    Total: {BannerDatas?.pagination_info?.total_records} banners
                  </span>
                </div>

                <div className="pagination-controls">
                  <button
                    onClick={() => handlePageClick(activePage - 1)}
                    disabled={activePage === 1}
                    className="pagination-btn nav-btn"
                  >
                    <FiChevronLeft size={18} />
                    Previous
                  </button>

                  <div className="page-numbers">{renderPaginationItems()}</div>

                  <button
                    onClick={() => handlePageClick(activePage + 1)}
                    disabled={
                      activePage === BannerDatas?.pagination_info?.total_pages
                    }
                    className="pagination-btn nav-btn"
                  >
                    Next
                    <FiChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          !loading && (
            <div className="empty-state">
              <div className="empty-icon">
                <FiSearch size={48} />
              </div>
              <h3>No banners found</h3>
            </div>
          )
        )}
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

      <Toaster />
    </>
  );
};

export default Banner;
