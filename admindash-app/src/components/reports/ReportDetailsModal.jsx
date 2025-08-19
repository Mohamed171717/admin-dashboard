import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { format } from "date-fns";
import { db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { CheckCircle, Clock, X } from "lucide-react";

export default function ReportDetailsModal({
  report,
  isOpen,
  onClose,
  onResolve,
}) {
  const handleResolve = async () => {
    try {
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

  if (!report) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#FAF7F0] text-left align-middle shadow-xl transition-all border border-[#D8D2C2] max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-[#D8D2C2] flex-shrink-0">
                  <Dialog.Title className="text-lg font-semibold text-[#4A4947]">
                    Report Details
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-[#D8D2C2]/50"
                  >
                    <X className="w-5 h-5 text-[#4A4947]" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-6 overflow-y-auto">
                  {/* Reporter / Reported To */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-[#4A4947]/70">
                        Reporter
                      </h4>
                      <p className="mt-1 font-semibold">{report.reporter}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#4A4947]/70">
                        Reported To
                      </h4>
                      <p className="mt-1 font-semibold">{report.reportedTo}</p>
                    </div>
                  </div>

                  {/* Type & Status */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-[#4A4947]/70">
                        Report Type
                      </h4>
                      <span className="inline-flex mt-1 px-3 py-1 rounded-full text-sm bg-[#D8D2C2] text-[#4A4947]">
                        {report.complainType}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#4A4947]/70">
                        Status
                      </h4>
                      <span
                        className={`inline-flex mt-1 px-3 py-1 rounded-full text-sm font-medium items-center gap-1 ${
                          report.resolved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {report.resolved ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                        {report.resolved ? "Resolved" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <h4 className="text-sm font-medium text-[#4A4947]/70">
                      Date Reported
                    </h4>
                    <p className="mt-1">
                      {format(report.createdAt.toDate(), "PPpp")}
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-[#4A4947]/70">
                      Description
                    </h4>
                    <p className="mt-2 rounded-lg bg-[#D8D2C2]/30 p-4 text-sm">
                      {report.description}
                    </p>
                  </div>

                  {/* Evidence */}
                  {report.image && (
                    <div>
                      <h4 className="text-sm font-medium text-[#4A4947]/70">
                        Evidence
                      </h4>
                      <div className="mt-2 rounded-lg overflow-hidden border border-[#D8D2C2]">
                        <img
                          src={report.image}
                          alt="Evidence"
                          className="w-full max-h-80 object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#D8D2C2] flex-shrink-0 flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-[#4A4947] hover:bg-[#D8D2C2]/50"
                  >
                    Close
                  </button>
                  {!report.resolved && (
                    <button
                      onClick={handleResolve}
                      className="rounded-lg bg-[#B17457] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#9c604a]"
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
