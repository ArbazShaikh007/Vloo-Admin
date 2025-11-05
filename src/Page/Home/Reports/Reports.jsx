import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  MdCalendarToday,
  MdFilterList,
  MdSearch,
  MdTrendingUp,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdPlayArrow,
  MdFileDownload,
  MdPictureAsPdf,
} from "react-icons/md";
import axios from "../../../Common/Api/Api";
import { generatePDF, generateQuickPDF } from "./PDFGenerator";
import "./Reports.css";

const FILTER_MAP = {
  daily: "Daily",
  monthly: "Monthly",
  "3-months": "3 Months",
  "6-months": "6 Months",
  yearly: "Yearly",
  "custom-date": "Monthly", // ignored by API when specific_date is provided
};

const Reports = () => {
  const [selectedFilter, setSelectedFilter] = useState("monthly");
  const [customDate, setCustomDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateInputs, setShowDateInputs] = useState(false);

  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [summary, setSummary] = useState({
    total_count: 0,
    accepted_count: 0,
    pending_count: 0,
    cancelled_count: 0,
    completed_count: 0,
  });
  const [providerCount, setProviderCount] = useState(0);

  const token = JSON.parse(localStorage.getItem("MYtokan"));

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);

      const payload = {
        filter_text: FILTER_MAP[selectedFilter] || "Monthly",
        search_text: (searchTerm || "").trim(),
      };

      if (selectedFilter === "custom-date" && customDate) {
        payload.specific_date = customDate; // server overrides filter_text
      }

      const res = await axios.post("/admin_view/provider_monthly_report", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      const data = res?.data || {};
      if (data.status !== 1) {
        setProviders([]);
        setSummary({
          total_count: 0,
          accepted_count: 0,
          pending_count: 0,
          cancelled_count: 0,
          completed_count: 0,
        });
        setProviderCount(0);
        setLoading(false);
        return;
      }

      setProviders(Array.isArray(data.data) ? data.data : []);
      setSummary(
        data.summary || {
          total_count: 0,
          accepted_count: 0,
          pending_count: 0,
          cancelled_count: 0,
          completed_count: 0,
        }
      );
      setProviderCount(data.provider_counts || 0);
    } catch (e) {
      console.error("provider_monthly_report error:", e);
      setProviders([]);
      setSummary({
        total_count: 0,
        accepted_count: 0,
        pending_count: 0,
        cancelled_count: 0,
        completed_count: 0,
      });
      setProviderCount(0);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, customDate, searchTerm, token]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchReport(), 300);
    return () => clearTimeout(t);
  }, [fetchReport]);

  // Filter/date changes
  useEffect(() => {
    if (selectedFilter !== "custom-date") {
      fetchReport();
    } else if (customDate) {
      fetchReport();
    }
  }, [selectedFilter, customDate, fetchReport]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setShowDateInputs(filter === "custom-date");
    if (filter !== "custom-date") setCustomDate("");
  };

  const getProviderStats = (row) => ({
    total: row.total || 0,
    completed: row.completed || 0,
    accepted: row.accepted || 0,
    pending: row.pending || 0,
    rejected: row.cancelled || 0, // map cancelled to UI "Rejected"
  });

  const totalStats = useMemo(
    () => ({
      total: summary.total_count || 0,
      accepted: summary.accepted_count || 0,
      rejected: summary.cancelled_count || 0,
      pending: summary.pending_count || 0,
      completed: summary.completed_count || 0,
    }),
    [summary]
  );

  const handleDownloadPDF = async () => {
    const filterInfo = {
      period:
        selectedFilter === "custom-date"
          ? customDate
            ? `Specific Date: ${customDate}`
            : "Specific Date"
          : (FILTER_MAP[selectedFilter] || "Monthly"),
      searchTerm: searchTerm || null,
    };

    const reportData = {
      totalStats,
      providers: providers.map((p) => ({
        id: p.provider_id,
        name: p.provider_name,
        email: p.provider_email,
        phone: p.provider_mobile_number,
        rating: p.avarage_rating,
        stats: getProviderStats(p),
      })),
    };

    await generatePDF(reportData, filterInfo);
  };

  const handleQuickDownload = async () => {
    await generateQuickPDF("dashboard-content");
  };

  return (
    <div className="dashboard-container" id="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <MdTrendingUp className="title-icon" />
          Service Provider Dashboard
        </h1>
        <p className="dashboard-subtitle">
          Monitor and analyze service provider performance
        </p>

        <div className="download-section">
          <button
            className="download-btn primary"
            onClick={handleDownloadPDF}
            title="Download Detailed PDF Report"
            disabled={loading}
          >
            <MdPictureAsPdf className="download-icon" />
            Download Detailed Report
          </button>
          <button
            className="download-btn secondary"
            onClick={handleQuickDownload}
            title="Download Dashboard Screenshot"
            disabled={loading}
          >
            <MdFileDownload className="download-icon" />
            Quick Download
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <MdFilterList className="filter-icon" />
          <span className="filter-title">Filters</span>
        </div>

        <div className="filter-controls">
          <div className="time-filters">
            {[
              { key: "daily", label: "Daily" },
              { key: "monthly", label: "Monthly" },
              { key: "3-months", label: "3 Months" },
              { key: "6-months", label: "6 Months" },
              { key: "yearly", label: "Yearly" },
              { key: "custom-date", label: "Specific Date" },
            ].map((filter) => (
              <button
                key={filter.key}
                className={`filter-btn ${
                  selectedFilter === filter.key ? "active" : ""
                }`}
                onClick={() => handleFilterChange(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {showDateInputs && (
            <div className="date-inputs">
              <div className="date-input-group">
                <MdCalendarToday className="input-icon" />
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="date-input"
                  placeholder="Select date"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-input-group">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by provider name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Overall Stats */}
      <div className="stats-overview">
        <div className="stat-card total">
          <div className="stat-icon">
            <MdTrendingUp />
          </div>
          <div className="stat-content">
            <h3>Total Services</h3>
            <p className="stat-number">{totalStats.total}</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <MdCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">{totalStats.completed}</p>
          </div>
        </div>

        <div className="stat-card accepted">
          <div className="stat-icon">
            <MdPlayArrow />
          </div>
          <div className="stat-content">
            <h3>Accepted</h3>
            <p className="stat-number">{totalStats.accepted}</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">
            <MdAccessTime />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-number">{totalStats.pending}</p>
          </div>
        </div>

        <div className="stat-card rejected">
          <div className="stat-icon">
            <MdCancel />
          </div>
          <div className="stat-content">
            <h3>Rejected</h3>
            <p className="stat-number">{totalStats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <div className="table-header-content">
            <h2>Service Providers ({providerCount})</h2>
            <button
              className="download-btn small"
              onClick={handleDownloadPDF}
              title="Download Report"
              disabled={loading}
            >
              <MdPictureAsPdf className="download-icon" />
              Export PDF
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="providers-table">
            <thead>
              <tr>
                <th>Provider Info</th>
                <th>Rating</th>
                <th>Total</th>
                <th>Completed</th>
                <th>Accepted</th>
                <th>Pending</th>
                <th>Rejected</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => {
                const stats = getProviderStats(p);
                return (
                  <tr key={p.provider_id} className="provider-row">
                    <td className="provider-info">
                      <div className="provider-details">
                        <div className="provider-name">{p.provider_name}</div>
                        <div className="provider-contact">
                          <span className="provider-email">
                            {p.provider_email}
                          </span>
                          <span className="provider-phone">
                            {p.provider_mobile_number}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="rating-cell">
                      <div className="rating-badge">
                        ⭐ {p.avarage_rating ?? "0.0"}
                      </div>
                    </td>
                    <td className="stat-cell total-stat">{stats.total}</td>
                    <td className="stat-cell completed-stat">
                      {stats.completed}
                    </td>
                    <td className="stat-cell accepted-stat">
                      {stats.accepted}
                    </td>
                    <td className="stat-cell pending-stat">{stats.pending}</td>
                    <td className="stat-cell rejected-stat">
                      {stats.rejected}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!loading && providers.length === 0 && (
            <div className="empty-state">
              <p>No service providers found for the selected filters.</p>
            </div>
          )}
          {loading && (
            <div className="empty-state">
              <p>Loading report…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
