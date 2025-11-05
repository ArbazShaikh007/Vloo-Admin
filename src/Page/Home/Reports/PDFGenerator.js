import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../Assets/profile.png";
export const generatePDF = async (data, filterInfo) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = logo; // React asset image path

    img.onload = () => {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      // Updated color palette to match your theme
      const colors = {
        primary: [128, 215, 210], // #80d7d2
        primaryDark: [0, 77, 97], // #004d61
        secondary: [255, 255, 255], // #ffffff
        accent: [232, 248, 247], // #e8f8f7
        success: [72, 187, 120],
        warning: [237, 137, 54],
        error: [245, 101, 101],
        gray: {
          50: [249, 250, 251],
          100: [243, 244, 246],
          200: [229, 231, 235],
          300: [209, 213, 219],
          400: [156, 163, 175],
          500: [107, 114, 128],
          600: [75, 85, 99],
          700: [55, 65, 81],
          800: [31, 41, 55],
          900: [17, 24, 39],
        },
      };

      // Helper function to add gradient-like effect
      const addGradientHeader = (y, height, startColor, endColor) => {
        const steps = 20;
        const stepHeight = height / steps;

        for (let i = 0; i < steps; i++) {
          const ratio = i / steps;
          const r = Math.round(
            startColor[0] + (endColor[0] - startColor[0]) * ratio
          );
          const g = Math.round(
            startColor[1] + (endColor[1] - startColor[1]) * ratio
          );
          const b = Math.round(
            startColor[2] + (endColor[2] - startColor[2]) * ratio
          );

          pdf.setFillColor(r, g, b);
          pdf.rect(0, y + i * stepHeight, pageWidth, stepHeight, "F");
        }
      };

      // Modern header with your color scheme
      addGradientHeader(0, 50, colors.primary, colors.primaryDark);

      // 🔹 Logo box + Logo image
      //   pdf.setFillColor(255, 255, 255);
      //   pdf.roundedRect(margin, 10, 35, 25, 3, 3, "F");
      pdf.addImage(img, "PNG", margin + 2, 12, 31, 31); // 👈 logo draw

      //   // Company logo area
      //   pdf.setFillColor(255, 255, 255);
      //   pdf.roundedRect(margin, 10, 35, 25, 3, 3, "F");
      //   pdf.setTextColor(...colors.gray[600]);
      //   pdf.setFontSize(8);
      //   pdf.setFont("helvetica", "bold");
      //   pdf.text("LOGO", margin + 17.5, 25, { align: "center" });

      //   pdf.setImage("../../../Assets/profile.png", margin + 2, 12, 31, 21); // Replace with actual logo if available

      // Main title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("Service Provider Analytics", margin + 45, 20);

      // Subtitle
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Comprehensive Performance Report", margin + 45, 30);

      // Date and time
      pdf.setFontSize(9);
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      pdf.text(`Generated on ${dateStr} at ${timeStr}`, margin + 45, 38);

      // Filter information card
      let yPosition = 65;

      // Card background
      pdf.setFillColor(...colors.gray[50]);
      pdf.roundedRect(margin, yPosition - 5, contentWidth, 30, 2, 2, "F");

      // Card border
      pdf.setDrawColor(...colors.gray[200]);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, yPosition - 5, contentWidth, 30, 2, 2, "S");

      // Filter title
      pdf.setTextColor(...colors.gray[800]);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Report Configuration", margin + 5, yPosition + 3);

      // Filter details
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...colors.gray[600]);

      yPosition += 10;
      pdf.text(`Time Period: ${filterInfo.period}`, margin + 5, yPosition);

      if (filterInfo.dateRange) {
        yPosition += 5;
        pdf.text(`Date Range: ${filterInfo.dateRange}`, margin + 5, yPosition);
      }

      if (filterInfo.searchTerm) {
        yPosition += 5;
        pdf.text(
          `Search Filter: "${filterInfo.searchTerm}"`,
          margin + 5,
          yPosition
        );
      }

      // Statistics cards section
      yPosition += 20;

      pdf.setTextColor(...colors.gray[800]);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Performance Overview", margin, yPosition);

      yPosition += 12;

      const stats = data.totalStats;
      const statCards = [
        {
          label: "Total Services",
          value: stats.total,
          color: colors.primaryDark,
        },
        {
          label: "Completed",
          value: stats.completed,
          color: colors.success,
        },
        {
          label: "Accepted",
          value: stats.accepted,
          color: colors.primary,
        },
        {
          label: "Pending",
          value: stats.pending,
          color: colors.warning,
        },
        {
          label: "Rejected",
          value: stats.rejected,
          color: colors.error,
        },
      ];

      const cardWidth = (contentWidth - 16) / 5;
      const cardHeight = 30;

      statCards.forEach((stat, index) => {
        const x = margin + index * (cardWidth + 4);

        // Card background with shadow effect
        pdf.setFillColor(...colors.gray[100]);
        pdf.roundedRect(x + 1, yPosition + 1, cardWidth, cardHeight, 3, 3, "F");

        // Main card
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(x, yPosition, cardWidth, cardHeight, 3, 3, "F");

        // Card border
        pdf.setDrawColor(...colors.gray[200]);
        pdf.setLineWidth(0.3);
        pdf.roundedRect(x, yPosition, cardWidth, cardHeight, 3, 3, "S");

        // Colored top bar
        pdf.setFillColor(...stat.color);
        pdf.roundedRect(x, yPosition, cardWidth, 3, 3, 3, "F");

        // Icon and value
        pdf.setTextColor(...colors.gray[800]);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(stat.value.toString(), x + cardWidth / 2, yPosition + 13, {
          align: "center",
        });

        // Label
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...colors.gray[600]);
        pdf.text(stat.label, x + cardWidth / 2, yPosition + 22, {
          align: "center",
        });
      });

      // Service providers table
      yPosition += 45;

      // Table title
      pdf.setTextColor(...colors.gray[800]);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Service Provider Details", margin, yPosition);

      yPosition += 12;

      // Optimized table design for better data visibility
      const tableHeaders = [
        { text: "Provider Name", width: 30 },
        { text: "Email", width: 30 },
        { text: "Phone", width: 30 },
        { text: "Rating", width: 14 },
        { text: "Total", width: 14 },
        { text: "Done", width: 14 },
        { text: "Accept", width: 14 },
        { text: "Pending", width: 14 },
        { text: "Reject", width: 14 },
      ];

      // Table header background
      pdf.setFillColor(...colors.primaryDark);
      pdf.roundedRect(margin, yPosition - 3, contentWidth, 10, 2, 2, "F");

      // Header text
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");

      let xPos = margin + 2;
      tableHeaders.forEach((header) => {
        pdf.text(header.text, xPos, yPosition + 2);
        xPos += header.width;
      });

      yPosition += 10;

      // Table rows with better spacing and readability
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);

      const rowHeight = 12;
      const maxRowsPerPage = Math.floor(
        (pageHeight - yPosition - 30) / rowHeight
      );

      data.providers.forEach((provider, index) => {
        // Check if we need a new page
        if (index > 0 && index % maxRowsPerPage === 0) {
          pdf.addPage();
          yPosition = 30;

          // Repeat header on new page
          pdf.setFillColor(...colors.primaryDark);
          pdf.roundedRect(margin, yPosition - 3, contentWidth, 10, 2, 2, "F");

          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "bold");

          xPos = margin + 2;
          tableHeaders.forEach((header) => {
            pdf.text(header.text, xPos, yPosition + 2);
            xPos += header.width;
          });

          yPosition += 10;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7);
        }

        // Row background
        if (index % 2 === 0) {
          pdf.setFillColor(...colors.gray[50]);
          pdf.rect(margin, yPosition - 2, contentWidth, rowHeight, "F");
        }

        // Row border
        pdf.setDrawColor(...colors.gray[200]);
        pdf.setLineWidth(0.1);
        pdf.line(
          margin,
          yPosition + rowHeight - 2,
          margin + contentWidth,
          yPosition + rowHeight - 2
        );

        const stats = provider.stats;

        // Provider data with better formatting
        const rowData = [
          {
            text:
              provider.name.length > 18
                ? provider.name.substring(0, 15) + "..."
                : provider.name,
            width: 30,
          },
          {
            text:
              provider.email.length > 22
                ? provider.email.substring(0, 19) + "..."
                : provider.email,
            width: 30,
          },
          {
            text: provider.phone,
            width: 30,
          },
          {
            text: provider.rating,
            width: 14,
          },
          {
            text: stats.total.toString(),
            width: 14,
            color: colors.primaryDark,
          },
          {
            text: stats.completed.toString(),
            width: 14,
            color: stats.completed > 0 ? colors.success : colors.gray[500],
          },
          {
            text: stats.accepted.toString(),
            width: 14,
            color: stats.accepted > 0 ? colors.primary : colors.gray[500],
          },
          {
            text: stats.pending.toString(),
            width: 14,
            color: stats.pending > 0 ? colors.warning : colors.gray[500],
          },
          {
            text: stats.rejected.toString(),
            width: 14,
            color: stats.rejected > 0 ? colors.error : colors.gray[500],
          },
        ];

        xPos = margin + 2;

        rowData.forEach((data) => {
          // Set color for the text
          if (data.color) {
            pdf.setTextColor(...data.color);
          } else {
            pdf.setTextColor(...colors.gray[700]);
          }

          // Multi-line text handling for long content
          const lines = pdf.splitTextToSize(data.text, data.width - 4);
          pdf.text(lines[0], xPos, yPosition + 4);

          // If there are multiple lines, show the second line
          if (lines.length > 1) {
            pdf.setFontSize(6);
            pdf.text(lines[1], xPos, yPosition + 8);
            pdf.setFontSize(7);
          }

          xPos += data.width;
        });

        yPosition += rowHeight;
      });

      // Summary section at the end
      yPosition += 10;

      // Check if we need space for summary
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 30;
      }

      // Summary box
      pdf.setFillColor(...colors.accent);
      pdf.roundedRect(margin, yPosition, contentWidth, 40, 3, 3, "F");

      pdf.setDrawColor(...colors.primary);
      pdf.setLineWidth(1);
      pdf.roundedRect(margin, yPosition, contentWidth, 40, 3, 3, "S");

      pdf.setTextColor(...colors.primaryDark);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Report Summary", margin + 5, yPosition + 8);

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Total Providers: ${data.providers.length}`,
        margin + 5,
        yPosition + 18
      );
      pdf.text(`Total Services: ${stats.total}`, margin + 5, yPosition + 25);
      pdf.text(
        `Success Rate: ${
          stats.total > 0
            ? Math.round(
                ((stats.completed + stats.accepted) / stats.total) * 100
              )
            : 0
        }%`,
        margin + 5,
        yPosition + 32
      );

      // Modern footer
      const totalPages = pdf.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        // Footer background
        pdf.setFillColor(...colors.primaryDark);
        pdf.rect(0, pageHeight - 15, pageWidth, 15, "F");

        // Footer content
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");

        // Left side - Report info
        pdf.text(
          "Service Provider Analytics Dashboard",
          margin,
          pageHeight - 6
        );

        // Center - Page number
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 6, {
          align: "center",
        });

        // Right side - Generation info
        pdf.text(
          "Generated by Vloo Admin",
          pageWidth - margin,
          pageHeight - 6,
          {
            align: "right",
          }
        );

        // Decorative line
        pdf.setDrawColor(...colors.primary);
        pdf.setLineWidth(0.5);
        pdf.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
      }

      // Save with descriptive filename
      const fileName = `service-provider-analytics-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);
      resolve();
    };
  });
};

export const generateQuickPDF = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert("Dashboard element not found!");
    return;
  }

  try {
    // Show loading indicator with your color scheme
    const loadingDiv = document.createElement("div");
    loadingDiv.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                  background: rgba(0,77,97,0.9); display: flex; align-items: center; 
                  justify-content: center; z-index: 9999; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="margin-bottom: 20px;">📄 Generating PDF...</div>
          <div style="width: 200px; height: 4px; background: #333; border-radius: 2px; overflow: hidden;">
            <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #80d7d2, #004d61); 
                        animation: loading 2s infinite;"></div>
          </div>
        </div>
      </div>
      <style>
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      </style>
    `;
    document.body.appendChild(loadingDiv);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min(
      (pdfWidth - 20) / imgWidth,
      (pdfHeight - 40) / imgHeight
    );
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 20;

    // Add modern header with your colors
    pdf.setFillColor(128, 215, 210);
    pdf.rect(0, 0, pdfWidth, 15, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Dashboard Snapshot", 10, 10);

    pdf.setFontSize(8);
    pdf.text(new Date().toLocaleString(), pdfWidth - 10, 10, {
      align: "right",
    });

    // Add image
    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio,
      "",
      "FAST"
    );

    // Remove loading indicator
    document.body.removeChild(loadingDiv);

    const fileName = `dashboard-snapshot-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);

    // Remove loading indicator if it exists
    const loadingDiv = document.querySelector('[style*="position: fixed"]');
    if (loadingDiv) {
      document.body.removeChild(loadingDiv);
    }

    alert("❌ Error generating PDF. Please try again or contact support.");
  }
};
