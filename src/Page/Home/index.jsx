import React, { useContext } from "react";
import Navbar from "../../components/UI/Navbar/Navbar";
import Sidebar from "../../components/UI/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./Home.css";
import { GlobalContext } from "../../GlobalContext";
import { motion } from "framer-motion";
import { easeIn } from "framer-motion";

const Index = () => {
  const { isOpen } = useContext(GlobalContext);
  return (
    <>
      <Navbar />
      <div className="white" style={{ minHeight: "100vh", height: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "101px",
          }}>
          <div
            style={{ paddingTop: "101px", width: isOpen ? "360px" : "90px" }}>
            <Sidebar />
          </div>

          <motion.div
            className="Maintainer_main_div"
            layout
            transition={{ duration: 0.5, easeIn }}
            // animate={{ opacity: isOpen ? 0 : 1 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
      {/* <div className="home">
        <Sidebar />
        <div className="content">
          <Outlet />
        </div>
      </div> */}
    </>
  );
};

export default Index;
