import LibrarySales from "../components/transactions/LibrarySales";
import RecentTransactions from "../components/transactions/RecentTransactions";
import TransactionStats from "../components/transactions/TransactionStats";

export default function MonitorTransactions() {
  return (
    <div>
      <h2 className="mb-4 text-neutral font-semibold">Monitor Transactions</h2>
      <TransactionStats
        data={{ total: 2456, pending: 18, completed: 156, issues: 3 }}
      />
      <RecentTransactions />
      <LibrarySales />
      {/* pagination */}
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          className="btn btn-xs  rounded-lg py-4 px-3.5 text-sm bg-[#B17457] text-white hover:bg-[#9c604a]"
          // disabled={currentPage === 1}
          // onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        >
          <img src="src/assets/h174.svg" alt="" />
        </button>

        <span className="text-sm font-medium text-[#4A4947]">
          Page
          {/* {currentPage} of {totalPages} */}
        </span>

        <button
          className="btn btn-xs rounded-lg py-4 px-3.5 text-sm bg-[#B17457] text-white hover:bg-[#9c604a]"
          // disabled={currentPage === totalPages}
          // onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        >
          <img src="src/assets/h177.svg" alt="" />
        </button>
      </div>
    </div>
  );
}
