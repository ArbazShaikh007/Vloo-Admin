import React, { useState, useContext, useEffect } from "react";
import "./nav.css";
import logo from "../../../Assets/Logo.png";
// import NavDropdown from "react-bootstrap/NavDropdown";
import { Dropdown } from "react-bootstrap";
import profile_pic from "../../../Assets/userlist/Nabil.png";
import { GlobalContext } from "../../../GlobalContext";
import axios from "../../../Common/Api/Api";
import defultimg from "../../../Assets/defultimg.png";

import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBBadge,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const {
    changePasswordshow,
    setchangePasswordshow,
    setLogoutModalshow,
    profiledata,
    setprofileData,
  } = useContext(GlobalContext);

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New message from John" },
    { id: 2, message: "Your order has been shipped" },
    { id: 3, message: "Reminder: Meeting at 3PM" },
  ]);
  const navigate = useNavigate();

  const toggleNotifications = () => setIsOpen(!isOpen);

  const profilee = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      id="profileico"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_17_4180)">
        <path
          d="M4 22C4 19.8783 4.84285 17.8434 6.34315 16.3431C7.84344 14.8429 9.87827 14 12 14C14.1217 14 16.1566 14.8429 17.6569 16.3431C19.1571 17.8434 20 19.8783 20 22H18C18 20.4087 17.3679 18.8826 16.2426 17.7574C15.1174 16.6321 13.5913 16 12 16C10.4087 16 8.88258 16.6321 7.75736 17.7574C6.63214 18.8826 6 20.4087 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"
          fill="#14161B"
          // fill={hover ? "white" : "black"}
        />
      </g>
      <defs>
        <clipPath id="clip0_17_4180">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
  const logout = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      id="profileico"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_17_4182)">
        <path
          d="M5 22C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V3C4 2.73478 4.10536 2.48043 4.29289 2.29289C4.48043 2.10536 4.73478 2 5 2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V6H18V4H6V20H18V18H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5ZM18 16V13H11V11H18V8L23 12L18 16Z"
          fill="#14161B"
        />
      </g>
      <defs>
        <clipPath id="clip0_17_4182">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
  const profile_icon = (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.2956 0C5.95085 0 0 5.95085 0 13.2956C0 20.6403 5.95085 26.5912 13.2956 26.5912C20.6403 26.5912 26.5912 20.6403 26.5912 13.2956C26.5912 5.95085 20.6403 0 13.2956 0ZM13.2956 5.14668C15.9011 5.14668 18.0134 7.25896 18.0134 9.86447C18.0134 12.47 15.9011 14.5823 13.2956 14.5823C10.6901 14.5823 8.5778 12.47 8.5778 9.86447C8.5778 7.25896 10.6901 5.14668 13.2956 5.14668ZM13.2956 23.5889C10.1486 23.5889 7.32866 22.1629 5.44154 19.9327C6.44943 18.0348 8.42233 16.7267 10.7222 16.7267C10.8509 16.7267 10.9796 16.7482 11.1029 16.7857C11.7998 17.0108 12.5289 17.1556 13.2956 17.1556C14.0622 17.1556 14.7967 17.0108 15.4883 16.7857C15.6116 16.7482 15.7403 16.7267 15.8689 16.7267C18.1688 16.7267 20.1417 18.0348 21.1496 19.9327C19.2625 22.1629 16.4426 23.5889 13.2956 23.5889Z"
        fill="#000"
      />
    </svg>
  );
  const changepass = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_17_3887)">
        <path
          d="M6 8V7C6 5.4087 6.63214 3.88258 7.75736 2.75736C8.88258 1.63214 10.4087 1 12 1C13.5913 1 15.1174 1.63214 16.2426 2.75736C17.3679 3.88258 18 5.4087 18 7V8H20C20.2652 8 20.5196 8.10536 20.7071 8.29289C20.8946 8.48043 21 8.73478 21 9V21C21 21.2652 20.8946 21.5196 20.7071 21.7071C20.5196 21.8946 20.2652 22 20 22H4C3.73478 22 3.48043 21.8946 3.29289 21.7071C3.10536 21.5196 3 21.2652 3 21V9C3 8.73478 3.10536 8.48043 3.29289 8.29289C3.48043 8.10536 3.73478 8 4 8H6ZM19 10H5V20H19V10ZM11 15.732C10.6187 15.5119 10.3207 15.1721 10.1522 14.7653C9.98376 14.3586 9.9542 13.9076 10.0681 13.4823C10.1821 13.057 10.4332 12.6813 10.7825 12.4132C11.1318 12.1452 11.5597 11.9999 12 11.9999C12.4403 11.9999 12.8682 12.1452 13.2175 12.4132C13.5668 12.6813 13.8179 13.057 13.9319 13.4823C14.0458 13.9076 14.0162 14.3586 13.8478 14.7653C13.6793 15.1721 13.3813 15.5119 13 15.732V18H11V15.732ZM8 8H16V7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7V8Z"
          fill="#14161B"
        />
      </g>
      <defs>
        <clipPath id="clip0_17_3887">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
  const noti = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_91_3614)">
        <path
          d="M20 17H22V19H2V17H4V10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10V17ZM18 17V10C18 8.4087 17.3679 6.88258 16.2426 5.75736C15.1174 4.63214 13.5913 4 12 4C10.4087 4 8.88258 4.63214 7.75736 5.75736C6.63214 6.88258 6 8.4087 6 10V17H18ZM9 21H15V23H9V21Z"
          fill="#000"
        />
      </g>
      <defs>
        <clipPath id="clip0_91_3614">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
  const ico = (
    <svg
      width="23"
      height="23"
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
  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const getprofile = async () => {
    try {
      const Response = await axios.get("/admin/get_profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${MyToken}`,
        },
      });

      setprofileData(Response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getprofile();
  }, []);

  return (
    <div className="main_nav">
      <div className="sub_nav_div">
        <div className="logo_box_navbar"></div>
        <div className="text">
          {/* ! <div className="search_main_div">
            <div className="input_box">
              <input type="text" />
            </div>
            <NavLink to="/">{ico}</NavLink>
          </div> */}

          {/* <NavLink to="/Home/Notification" className="notification">
            {noti}
            <span class="badge">3</span>
          </NavLink> */}
          <MDBDropdown group>
            <MDBDropdownToggle
              style={{ background: "var(--main-background-color-dark-green)" }}
              className="main_dropdown_div"
            >
              <div className="profile_pic_box">
                <img
                  src={
                    profiledata?.profile_pic
                      ? profiledata?.profile_pic
                      : defultimg
                  }
                  alt=""
                />
              </div>

              <span>{profiledata?.firstname}</span>
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem link onClick={() => navigate("/Home/Profile")}>
                <span className="inner_item">{profile_icon} My profile</span>
              </MDBDropdownItem>
              <MDBDropdownItem link onClick={setchangePasswordshow}>
                <span className="inner_item">{changepass} Change Password</span>
              </MDBDropdownItem>
              <MDBDropdownItem link>
                <span className="inner_item" onClick={setLogoutModalshow}>
                  {logout} Log out
                </span>
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
