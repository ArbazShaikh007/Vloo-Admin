import React, { useState, useEffect, useContext } from "react";
import "./Das.css";
import { useNavigate } from "react-router-dom";
import axios from "../../../Common/Api/Api";
import { toast, Toaster } from "react-hot-toast";
import Loader from "../../../Common/loader/index";
import Backdrop from "@mui/material/Backdrop";
import ReactApexChart from "react-apexcharts";
import { FaUsers } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import { MdMiscellaneousServices } from "react-icons/md";
import { GlobalContext } from "../../../GlobalContext";

const Index = () => {
  const navigate = useNavigate();

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));
  const [loading, setloading] = useState(false);
  const [Dashcount, setDashcount] = useState();

  const { is_subadmin } = useContext(GlobalContext);

  const Dashboardcount = async () => {
    setloading(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const Response = await axios.post(
        "/admin_view/dashboard",
        {
          timezone: timezone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      console.log("🚀 ~ Dashboardcount ~ Response:", Response);
      setDashcount(Response.data);
      setloading(false);
    } catch (error) {
      console.log("Dashboardcount error:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    Dashboardcount();
  }, []);

  const cardItems = is_subadmin
    ? [
        {
          icon: FaUserTie,
          name: "Total Workers",
          link: "/Home/ServiceProvider",
          count: Dashcount?.provider_counts,
        },
        {
          icon: MdMiscellaneousServices,
          name: "Total Services",
          link: "/Home/AllServices",
          count: Dashcount?.services_counts,
        },
      ]
    : [
        {
          icon: FaUsers,
          name: "Total Users",
          link: "/Home/Userlist",
          count: Dashcount?.user_counts,
        },
        {
          icon: FaUserTie,
          name: "Total Provider",
          link: "/Home/ServiceProvider",
          count: Dashcount?.provider_counts,
        },
        {
          icon: MdMiscellaneousServices,
          name: "Total Services",
          link: "/Home/AllServices",
          count: Dashcount?.services_counts,
        },
      ];

  class ApexChart extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        series: [
          {
            name: "Month wise user",
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 10, 39, 21],
          },
        ],
        options: {
          chart: {
            type: "bar",
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded",
            },
          },
          colors: ["#0addc1", "#191f23", "#191f23"],
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
          },
          xaxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
          },
          yaxis: {
            title: {
              text: "Month Wise User Registered",
            },
          },
          fill: {
            opacity: 1,
            type: "gradient",
            gradient: {
              shade: "darker",
              type: "vertical",
              shadeIntensity: 0.25,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [50, 100],
            },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val;
              },
            },
          },
        },
      };
    }

    render() {
      return (
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={350}
          />
        </div>
      );
    }
  }

  class ApexpeiChart extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        series: [25, 75],
        options: {
          chart: {
            width: 380,
            type: "pie",
          },
          colors: ["#0addc1", "#191f23", "#191f23"],
          labels: ["Android", "ios"],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
      };
    }

    render() {
      return (
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="pie"
            width={380}
          />
        </div>
      );
    }
  }

  return (
    <>
      <Toaster />
      <div className="All-Conatinor-perfect-divv">
        <div className="All-Containor-perfect-second-divv">
          <div className="main_des_div">
            <div className="card_div">
              {cardItems.map((item, index) => {
                return (
                  <div
                    className="card"
                    key={index}
                    onClick={() => navigate(item.link)}
                  >
                    <div className="image">
                      <span>{<item.icon />}</span>
                    </div>
                    <div className="card-info">
                      <span>{item.count}</span>
                      <p>{item.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart section (optional) */}
            {/* <div className="Des_heading_text">
              <h2>User Data</h2>
            </div>
            <div className="main_chat">
              <div className="month_wise_chat">
                <ApexChart />
              </div>
              <div className="paichat">
                <ApexpeiChart />
              </div>
            </div> */}
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

export default Index;
