import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import ReportsTable from "../components/reports/ReportsTable";
import ReportDetailsModal from "../components/reports/ReportDetailsModal";
import TransactionStats from "../components/transactions/TransactionStats";
import ResportStats from "../components/reports/ReportStats";
import ReportCharts from "../components/reports/ReportsCharts";

export default function MonitorReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    search: "",
  });

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    // Subscribe to reports collection
    const reportsRef = collection(db, "complains");
    const q = query(reportsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleReportResolved = (reportId) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, resolved: true } : report
      )
    );
    handleCloseModal();
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setCurrentPage(1);
    }, 600);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const searchTerm = filters.search.toLowerCase();
    const typeMatch =
      filters.type === "all" || report.complainType === filters.type;
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "resolved" && report.resolved) ||
      (filters.status === "pending" && !report.resolved);
    const searchMatch =
      !searchTerm ||
      report.reporter?.toLowerCase().includes(searchTerm) ||
      report.reportedTo?.toLowerCase().includes(searchTerm);

    return typeMatch && statusMatch && searchMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <h2 className="mb-4 text-neutral font-semibold">Monitor Reports</h2>
      <ReportCharts reports={reports} />
      {/* <ResportStats
        data={{
          total: reports.length,
          resolved: reports.filter((r) => r.resolved).length,
          pending: reports.filter((r) => !r.resolved).length,
        }}
      /> */}

      {/* Search and Filters */}
      <div className="flex flex-wrap flex-col sm:flex-row justify-start gap-3 mb-4">
        <div className="bg-white border-secondary border rounded-lg flex gap-2 pr-2 flex-2 min-w-3xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 my-2.5 mx-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <input
            type="search"
            className="w-full outline-none"
            placeholder="Search by reporter or reportedTo ..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <select
          className="bg-[#FAF7F0] border border-[#D8D2C2] rounded-lg px-3 py-2 text-sm text-[#4A4947] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B17457] transition"
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
        >
          <option value="all">All Types</option>
          <option value="book">Book</option>
          <option value="user">User</option>
        </select>

        <select
          className="bg-[#FAF7F0] border border-[#D8D2C2] rounded-lg px-3 py-2 text-sm text-[#4A4947] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B17457] transition"
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="bg-base-100 rounded-lg shadow-xl">
        <ReportsTable
          reports={paginatedReports}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            className="btn btn-xs rounded-lg py-4 px-3.5 text-sm bg-[#B17457] text-white hover:bg-[#9c604a]"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <img src="src/assets/h174.svg" alt="Previous" />
          </button>

          <span className="text-sm font-medium text-[#4A4947]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-xs rounded-lg py-4 px-3.5 text-sm bg-[#B17457] text-white hover:bg-[#9c604a]"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <img src="src/assets/h177.svg" alt="Next" />
          </button>
        </div>
      )}

      <ReportDetailsModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onResolve={handleReportResolved}
      />
    </div>
  );
}
