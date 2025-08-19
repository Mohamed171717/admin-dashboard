import { getBookOwner } from "@/lib/gettingOwner";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

export const BookTable = ({ books, changeApproval, deleteBook }) => {
  const statusBadge = {
    approved: "bg-green-500 text-white",
    pending: "bg-yellow-400 text-white",
    rejected: "bg-red-500 text-white",
  };

  const [owners, setOwners] = useState({});

  useEffect(() => {
    const fetchOwners = async () => {
      const results = {};
      for (const book of books) {
        const owner = await getBookOwner(book.ownerId);
        if (owner) {
          results[book.id] = owner;
        }
      }
      setOwners(results);
    };

    fetchOwners();
  }, [books]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full text-sm text-left text-[#4A4947]">
        {/* Head */}
        <thead className="bg-[#D8D2C2] text-[#4A4947] text-sm uppercase">
          <tr>
            <th className="px-4 py-3">Book</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Submitted By</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {books.map((book) => {
            const owner = owners[book.id];
            if (!owner) return null;
            return (
              <tr
                key={book.id}
                className="border-b hover:bg-[#FAF7F0] transition"
              >
                {/* Book info */}
                <td className="px-4 py-3 flex items-center gap-3 min-w-55">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-12 h-16 rounded object-cover shadow"
                  />
                  <div>
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.date}</p>
                  </div>
                </td>

                {/* Author */}
                <td className="px-4 py-3 min-w-35">{book.author}</td>

                {/* Submitted By */}
                <td className="px-4 py-3 min-w-55">
                  <p>{owner ? owner.name : "loading ..."}</p>
                  <p className="text-xs text-gray-500 my-1">
                    {owner ? owner.email : "loading ..."}
                  </p>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#B17457] text-white">
                    {owner
                      ? owner?.role === "reader"
                        ? "Individual"
                        : "Library"
                      : "loading ..."}
                  </span>
                </td>

                {/* Price */}
                <td className="px-4 py-3">{book.price} EGP</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusBadge[book.approval]
                    }`}
                  >
                    {book.approval[0].toUpperCase() + book.approval.slice(1)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-center min-w-55">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => changeApproval(book.id, "approved")}
                      disabled={book.approval === "approved"}
                      className={`px-3 py-2 rounded text-white text-xs ${
                        book.approval === "approved"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#B17457] hover:brightness-110"
                      }`}
                    >
                      ✔ Approve
                    </button>

                    <button
                      onClick={() => changeApproval(book.id, "rejected")}
                      disabled={book.approval === "rejected"}
                      className={`px-3 py-2 rounded text-xs ${
                        book.approval === "rejected"
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-[#FAF7F0] text-[#B17457] border border-[#B17457] hover:bg-[#e9e4d7]"
                      }`}
                    >
                      ✖ Reject
                    </button>

                    {book.isDeleted && (
                      <button
                        onClick={() => deleteBook(book.docId)}
                        className="flex items-center justify-center px-3 py-1 rounded text-xs text-red-600 hover:text-white hover:bg-red-500 transition"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
