import { FaEdit, FaTrash } from "react-icons/fa";

export default function BookCard({ book, user, changeApproval, deleteBook }) {
  const statusBadge = {
    approved: "bg-green-500 text-white",
    pending: "bg-yellow-400 text-white",
    rejected: "bg-red-500 text-white",
  };
  // console.log(user);

  return (
    <div className="bg-[#D8D2C2] rounded-xl shadow-md p-4 w-full max-w-sm overflow-x-hidden">
      {/* source - date */}
      <div className="flex justify-between items-center mb-3">
        <span className="bg-[#B17457] text-white text-xs px-2 py-1 rounded-full">
          {user.role == "reader" ? "Individual" : "Library"}
        </span>
        <span className="text-xs text-[#4A4947]">{book.date}</span>
      </div>

      <div className="flex gap-4">
        {/* Book Image object-cover */}
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-32 h-44  rounded-md mb-3"
        />

        <div className="text">
          {/* Book Details */}
          <h2 className="font-semibold text-lg text-[#4A4947] mb-1">
            {book.title}
          </h2>
          <p className="text-[#4A4947] text-sm mb-1">{book.author}</p>
          {/* <p className="text-[#4A4947] text-sm">ISBN: {book.isbn}</p> */}

          {/* Submitted By */}
          <p className="text-sm text-[#4A4947] mt-2">
            Submitted by: {user.name}
            <br />
            <span className="text-xs text-[#4A4947]">{user.email}</span>
          </p>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="mt-1">
        <span
          className={`text-sm py-1 px-3 rounded-full font-medium
          ${statusBadge[book.approval]}
        `}
        >
          {book.approval[0].toUpperCase() + book.approval.slice(1)}
        </span>

        <div className="mt-3 flex justify-between flex-wrap">
          <div>
            <button
              onClick={() => changeApproval(book.id, "approved")}
              disabled={book.approval === "approved"}
              className={`btn px-6 text-white border-none mr-3 rounded-lg 
                ${
                  book.approval === "approved"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#B17457] hover:brightness-110"
                }
              `}
            >
              ✔ Approve
            </button>

            <button
              onClick={() => changeApproval(book.id, "rejected")}
              disabled={book.approval === "rejected"}
              className={`btn px-6 border rounded-lg transition duration-200 
                ${
                  book.approval === "rejected"
                    ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                    : "bg-[#FAF7F0] text-[#B17457] border-[#B17457] hover:bg-[#e9e4d7]"
                }
              `}
            >
              ✖ Reject
            </button>
          </div>
          <div>
            {/* <button className="btn btn-sm btn-ghost text-[#4A4947]">
              <FaEdit />
            </button> */}
            {book.isDeleted && (
              <button
                onClick={() => deleteBook(book.docId)}
                className="btn btn-sm btn-ghost text-[#4A4947]"
              >
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
