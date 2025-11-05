import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
import { GlobalContext } from "../../../GlobalContext";
import "./sidebar.css";
import logo from "../../../Assets/Logo.png";
import mobile_logo from "../../../Assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa6";
import { MdMiscellaneousServices } from "react-icons/md";
import { MdOutlineQuestionAnswer, MdOutlineWeb } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaImages } from "react-icons/fa6";
import { MdBrandingWatermark } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { IoIosTime } from "react-icons/io";
import { GrServices } from "react-icons/gr";
import { BiSolidCarGarage } from "react-icons/bi";
import { FaPuzzlePiece } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaInfoCircle } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";

const menuItems = [
  {
    name: "Dashboard",
    icon: <RiDashboardHorizontalFill />,
    link: "/Home/Dashboard",
  },
  {
    name: "Store Time",
    icon: <IoIosTime />,
    link: "/Home/StoreTime",
  },
  {
    name: "User Lists",
    icon: <FaUsers />,
    link: "/Home/Userlist",
  },
  {
    name: "Services",
    icon: <GrServices />,
    items: [
      {
        name: "All Services",
        link: "/Home/AllServices",
        icon: <MdMiscellaneousServices />,
      },
      {
        name: "Service Provider",
        link: "/Home/ServiceProvider",
        icon: <FaUserTie />,
      },
      {
        name: "Zone",
        link: "/Home/Zone",
        icon: <FaMapLocationDot />,
      },
      {
        name: "Assign",
        link: "/Home/Assign",
        icon: <MdAssignmentTurnedIn />,
      },
    ],
  },
  {
    name: "Cars",
    icon: <BiSolidCarGarage />,
    items: [
      {
        name: "Brand",
        link: "/Home/Brand",
        icon: <MdBrandingWatermark />,
      },
      {
        name: "Car Modal",
        link: "/Home/CarModal",
        icon: <FaCar />,
      },
    ],
  },
  {
    name: "Banner",
    link: "/Home/Banner",
    icon: <FaImages />,
  },
  {
    name: "Extras",
    link: "/Home/Extras",
    icon: <FaPuzzlePiece />,
  },
  {
    name: "Contact Us",
    link: "/Home/Contact-us",
    icon: <BiSupport />,
  },
  {
    name: "Reports",
    link: "/Home/Reports",
    icon: <MdAssessment />,
  },
  {
    name: "CMS",
    icon: <MdOutlineWeb />,
    items: [
      {
        name: "Privacy Policy",
        link: "/Home/PrivacyPolicy",
        icon: <RiLockPasswordLine />,
      },
      {
        name: "About Us",
        link: "/Home/About-us",
        icon: <FaInfoCircle />,
      },
      {
        name: "Faq's",
        link: "/Home/Faqs",
        icon: <MdOutlineQuestionAnswer />,
      },
    ],
  },
];

const Icon = ({ icon }) => (
  <span className="material-symbols-outlined">{icon}</span>
);

const NavHeader = ({ toggleSidebar, isOpen }) => (
  <header className="sidebar-header">
    <button type="button" onClick={toggleSidebar}>
      <Icon icon="menu" />
    </button>
    {isOpen && <span className="main_logo_img"></span>}
    {isOpen && <img className="main_logo_img" src={logo} alt="Logo" />}
    <img src={mobile_logo} alt="" className="mobile_view_logo" />
  </header>
);

const NavButton = ({ onClick, name, icon, isActive, hasSubNav, isOpen }) => (
  <button
    type="button"
    onClick={() => onClick(name)}
    className={`nav-button ${isActive ? "active" : ""} ${
      hasSubNav && !isOpen ? "hasSubNav-closed" : ""
    }`}
  >
    {icon && <span className="icon-wrapper">{icon}</span>}
    <span style={{ display: isOpen ? null : "none" }}>{name}</span>
    {hasSubNav && isOpen && <Icon icon="expand_more" />}
  </button>
);

const SubMenu = ({ item, activeItem, handleClick, selectedItem, isOpen }) => {
  const navRef = useRef(null);
  const [subNavOpen, setSubNavOpen] = useState(false);

  useEffect(() => {
    if (
      selectedItem === item.name ||
      item.items.some((subItem) => subItem.name === activeItem)
    ) {
      setSubNavOpen(true);
    }
  }, [activeItem, item.items, selectedItem]);

  return (
    <div
      className={`sub-nav ${subNavOpen ? "open" : ""}`}
      style={{
        height: subNavOpen ? navRef.current?.clientHeight : 0,
      }}
    >
      <div ref={navRef} className="sub-nav-inner">
        {item.items.map((subItem) => (
          <NavButton
            key={subItem.name}
            onClick={() => handleClick(subItem)}
            icon={subItem.icon}
            name={subItem.name}
            isActive={activeItem === subItem.name}
            isOpen={isOpen}
          />
        ))}
      </div>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { isOpen, setIsOpen, is_subadmin } = useContext(GlobalContext);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [activeItem, setActiveItem] = useState(menuItems[0].name);
  const [subActiveItem, setSubActive] = useState(menuItems[1].name);
  const [selectedItem, setSelectedItem] = useState(menuItems[0].name);
  const navi = useNavigate();

  console.log("📦 Sidebar → is_subadmin from context:", is_subadmin);

  // ✅ memoize so it doesn't change every render
  const filteredMenuItems = useMemo(() => {
    return is_subadmin
      ? menuItems.filter(
          (m) =>
            m.name !== "Store Time" &&
            m.name !== "Cars" &&
            m.name !== "Banner" &&
            m.name !== "Extras" &&
            m.name !== "Contact Us" &&
            m.name !== "Reports" &&
            m.name !== "CMS"
        )
      : menuItems;
  }, [is_subadmin]);

  console.log(
    "📦 Sidebar → final menu list:",
    filteredMenuItems.map((m) => m.name)
  );

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMainItemClick = (item) => {
    if (item.items) {
      setOpenSubMenus((prevOpenSubMenus) => ({
        ...prevOpenSubMenus,
        [item.name]: !prevOpenSubMenus[item.name],
      }));
    }
    handleClick(item);
  };

  const handleClick = (item) => {
    console.log("👉 clicked menu/item:", item);
    setActiveItem(item.name);
    setSelectedItem(item.name);
    setSubActive(item.name);
    if (item.link) {
      navi(item.link);
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;

    const findActiveItem = (items) => {
      for (const item of items) {
        if (item.link && item.link === currentPath) {
          return item.name;
        }
        if (item.items) {
          const activeSubItem = findActiveItem(item.items);
          if (activeSubItem) {
            setOpenSubMenus((prevOpenSubMenus) => ({
              ...prevOpenSubMenus,
              [item.name]: true,
            }));
            return activeSubItem;
          }
        }
      }
      return null;
    };

    const activeItemName = findActiveItem(filteredMenuItems);
    if (activeItemName) {
      setActiveItem(activeItemName);
      setSelectedItem(activeItemName);
    }
  }, [location.pathname, filteredMenuItems]); // ✅ only path + memoized array

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <NavHeader toggleSidebar={toggleSidebar} isOpen={isOpen} />
      <div className="main_item_div_of_sidebar">
        {filteredMenuItems.map((item) => (
          <div key={item.name} className="item_div_of_sidebar">
            <NavButton
              onClick={() => handleMainItemClick(item)}
              name={item.name}
              icon={item.icon}
              isActive={selectedItem === item.name}
              hasSubNav={!!item.items}
              isOpen={isOpen}
            />
            {item.items && openSubMenus[item.name] && (
              <SubMenu
                item={item}
                activeItem={activeItem}
                handleClick={handleClick}
                selectedItem={selectedItem}
                isOpen={isOpen}
              />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
