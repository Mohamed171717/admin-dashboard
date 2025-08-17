import { formatDate } from "../../lib/utils";

const ReportsTable = ({ reports, onViewDetails }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="text-neutral">
            <th>Date</th>
            <th>From</th>
            <th>For</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="hover">
              <td className="text-sm">
                {formatDate(report.createdAt.toDate(), "MMM dd, yyyy")}
              </td>
              <td>
                <div className="font-semibold">{report.reporter}</div>
              </td>
              <td>
                <div className="font-semibold">{report.reportedTo}</div>
              </td>
              <td>
                <div className="badge badge-ghost">{report.complainType}</div>
              </td>
              <td>
                <div
                  className={`badge ${
                    report.resolved
                      ? "badge-success text-success-content"
                      : "badge-warning text-warning-content"
                  }`}
                >
                  {report.resolved ? "Resolved" : "Pending"}
                </div>
              </td>
              <td>
                <button
                  className="btn btn-ghost btn-sm bg-[#FAF7F0] text-[#B17457] border-[#B17457] hover:bg-[#e9e4d7]"
                  onClick={() => onViewDetails(report)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;
