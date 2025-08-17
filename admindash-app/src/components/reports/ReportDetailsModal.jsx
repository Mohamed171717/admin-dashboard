import { format } from "date-fns";
import { db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const ReportDetailsModal = ({ report, isOpen, onClose, onResolve }) => {
  const handleResolve = async () => {
    try {
      console.log(report.id);
      const reportRef = doc(db, "complains", report.id);
      await updateDoc(reportRef, {
        resolved: true,
        resolvedAt: new Date(),
      });
      onResolve(report.id);
    } catch (error) {
      console.error("Error resolving report:", error);
    }
  };

  if (!isOpen || !report) return null;

  return (
    <dialog className="modal modal-bottom sm:modal-middle" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Report Details</h3>

        {/* Report Information */}
        <div className="space-y-4 ">
          {/* Reporter Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Reporter</h4>
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-sm">{report.reporter}</div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Reported To</h4>
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-sm ">{report.reportedTo}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Report Type</h4>
              <div className="badge badge-ghost">{report.complainType}</div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Status</h4>
              <div
                className={`badge ${
                  report.resolved
                    ? "badge-success text-success-content"
                    : "badge-warning text-warning-content"
                }`}
              >
                {report.resolved ? "Resolved" : "Pending"}
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <h4 className="font-semibold mb-2">Date Reported</h4>
            <p>{format(report.createdAt.toDate(), "PPpp")}</p>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-sm bg-base-200 p-4 rounded-lg">
              {report.description}
            </p>
          </div>

          {/* Evidence Image */}
          {report.image && (
            <div>
              <h4 className="font-semibold mb-2">Evidence</h4>
              <div className="w-full">
                <img
                  src={report.image}
                  alt="Report Evidence"
                  className="rounded-lg max-h-96 w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          {!report.resolved && (
            <button className="btn btn-primary" onClick={handleResolve}>
              Mark as Resolved
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ReportDetailsModal;
