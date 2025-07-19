// components/LibrarySales.jsx

export default function LibrarySales() {
  const sales = [
    {
      library: "Central Library",
      book: "Computer Science Fundamentals",
      amount: "$299.99",
      status: "Paid",
      date: "2024-01-20",
    },
    {
      library: "City Library",
      book: "Modern Web Development",
      amount: "$199.99",
      status: "Pending",
      date: "2024-01-20",
    },
  ];

  const statusColors = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="bg-base-100 rounded-xl pt-3 mt-6 shadow-sm">
      <h3 className="text-lg pl-3 font-semibold text-[#4A4947] mb-3">
        Library Sales
      </h3>

      <div className="overflow-x-auto">
        <table className="table w-full rounded-xl">
          <thead className="bg-[#D8D2C2] text-[#4A4947]">
            <tr>
              <th>Library</th>
              <th>Book</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-[#4A4947]">
            {sales.map((sale, idx) => (
              <tr key={idx} className="hover:bg-[#FAF7F0] transition">
                <td className="py-3">{sale.library}</td>
                <td className="py-3">{sale.book}</td>
                <td className="py-3 font-semibold">{sale.amount}</td>
                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusColors[sale.status]
                    }`}
                  >
                    {sale.status}
                  </span>
                </td>
                <td className="py-3">{sale.date}</td>
                <td className="py-3 flex gap-2">
                  <button className="btn btn-sm rounded-md bg-[#B17457] text-white hover:brightness-110 px-4">
                    Verify
                  </button>
                  <button className="btn btn-sm rounded-md bg-[#D8D2C2] text-[#4A4947] hover:brightness-95 px-4">
                    Resend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
