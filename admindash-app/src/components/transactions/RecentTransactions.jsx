// src/components/RecentTransactions.jsx
import { FaExchangeAlt, FaShoppingCart, FaUniversity } from "react-icons/fa";

const transactions = [
  {
    id: 1,
    date: "2024-01-20 14:30",
    type: "Sale",
    icon: <FaShoppingCart />,
    bookTitle: "The Art of Programming",
    buyer: "john.doe@email.com",
    seller: "bookstore@email.com",
    amount: "$49.99",
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-01-20 13:15",
    type: "Trade",
    icon: <FaExchangeAlt />,
    bookTitle: "Design Patterns + Clean Code",
    buyer: "alice@email.com",
    seller: "bob@email.com",
    amount: "$12.50",
    status: "Pending",
  },
  {
    id: 3,
    date: "2024-01-20 12:00",
    type: "Library Sale",
    icon: <FaUniversity />,
    bookTitle: "Data Structures",
    buyer: "central.library@email.com",
    seller: "academic.press@email.com",
    amount: "$89.99",
    status: "Cancelled",
  },
];

const statusStyle = {
  Completed: "bg-green-100 text-green-600",
  Pending: "bg-yellow-100 text-yellow-600",
  Cancelled: "bg-red-100 text-red-600",
};

export default function RecentTransactions() {
  return (
    <div className="bg-base-100 rounded-xl pt-3 shadow-sm">
      <div className="flex justify-between items-center mb-3 px-4">
        <h2 className="text-lg font-semibold text-neutral">
          Recent Transactions
        </h2>
        <button className="btn btn-sm btn-ghost">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead className="bg-[#D8D2C2] text-[#4A4947]">
            <tr>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Book Title</th>
              <th>Participants</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t text-sm text-[#4A4947]">
                {/* Date & Time */}
                <td className="py-3 px-4 whitespace-nowrap align-middle text-sm">
                  <span>{tx.date}</span>
                  <br />
                  <span>{tx.time}</span>
                </td>

                {/* Type */}
                <td className="pt-5 px-4 whitespace-nowrap align-middle flex items-center gap-1">
                  {tx.icon}
                  <span>{tx.type}</span>
                </td>

                {/* Book Title */}
                <td className="py-3 px-4 align-middle">{tx.bookTitle}</td>

                {/* Participants */}
                <td className="py-3 px-4 text-sm leading-tight align-middle">
                  <div>
                    Buyer: <span className="text-gray-600">{tx.buyer}</span>
                  </div>
                  <div>
                    Seller: <span className="text-gray-600">{tx.seller}</span>
                  </div>
                </td>

                {/* Amount */}
                <td className="py-3 px-4 font-semibold align-middle">
                  {tx.amount}
                </td>

                {/* Status */}
                <td className="py-3 px-4 align-middle">
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${
                      statusStyle[tx.status]
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 align-middle">
                  <div className="flex gap-2">
                    <button className="bg-[#B17457] text-white text-sm px-3 py-1 rounded-md hover:brightness-110">
                      Complete
                    </button>
                    <button className="border border-gray-400 text-sm px-3 py-1 rounded-md hover:brightness-0">
                      Flag
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
