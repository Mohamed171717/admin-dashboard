import {
  FaExchangeAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function TransactionStats({ data }) {
  const stats = [
    {
      label: "Total Transactions",
      value: data.total || 0,
      icon: <FaExchangeAlt />,
    },
    {
      label: "Completed Today",
      value: data.completed || 0,
      icon: <FaCheckCircle />,
    },
    {
      label: "Issues Flagged",
      value: data.issues || 0,
      icon: <FaExclamationTriangle />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-[#D8D2C2] rounded-xl p-4 flex items-center gap-4 shadow-sm overflow-x-hidden"
        >
          <div className="text-xl text-[#B17457]">{stat.icon}</div>
          <div className="flex flex-1 items-center justify-between">
            <div className="text-sm text-[#4A4947]">{stat.label}</div>
            <div className="text-xl font-semibold text-[#4A4947]">
              {stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
