import { useEffect, useState } from "react";
import BookCard from "../components/books/BookCard";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { sendBookNotifications } from "../lib/sendNotifications";
import { sendBookRejectedNotification } from "../lib/sendOwnerNotif";
import { BookTable } from "../components/books/BookTable";

export default function ManageBooks() {
  const [viewMode, setViewMode] = useState("grid");
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    approval: "all",
  });
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const booksPerPage = 8;

  const fetchData = async () => {
    try {
      setLoading(true);
      // fetching books
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          docId: doc.id,
          id: data.id,
        };
      });
      setBooks(booksData);
      // console.log(booksData);
      // fetching users
      const querySnapshot2 = await getDocs(collection(db, "users"));
      const usersData = querySnapshot2.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // finish loading
    }
  };

  useEffect(() => {
    fetchData();
    //
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setCurrentPage(1);
    }, 600);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const changeApproval = async (id, action) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id ? { ...book, approval: action } : book
      )
    );

    const book = books.find((b) => b.id === id);
    if (!book || !book.docId) {
      console.error("Book or docId not found");
      return;
    }

    try {
      const bookRef = doc(db, "books", book.docId);
      await updateDoc(bookRef, {
        approval: action,
      });
      if (action === "approved") {
        await sendBookNotifications(book);
        console.log("sendBookNotifications");
      } else {
        await sendBookRejectedNotification(book);
        console.log("sendBookRejectedNotification");
      }
      console.log("Updated Firestore successfully", action);
    } catch (err) {
      console.error("Error updating approval:", err);
    }
  };

  const deleteBook = async (docId) => {
    try {
      await deleteDoc(doc(db, "books", docId));
      console.log("Book deleted successfully");

      setBooks((prev) => prev.filter((book) => book.docId !== docId));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const filteredBooks = books.filter((book) => {
    const searchTerm = filters.search.toLowerCase();
    const searchMatch =
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm);

    const approvalMatch =
      filters.approval === "all" ||
      book.approval?.toLowerCase() === filters.approval;

    return searchMatch && approvalMatch;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  return (
    <div>
      <h2 className="mb-4 text-neutral font-semibold">Manage Books</h2>
      {/* Filters */}
      <div className="flex flex-wrap flex-col sm:flex-row justify-start  gap-3 mb-4">
        <div className="bg-white border border-[#D8D2C2] shadow-sm rounded-lg flex gap-2 pr-2 flex-2 min-w-3xs">
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
            placeholder="Search books by title or author ..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <select
          value={filters.approval}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, approval: e.target.value }))
          }
          className="bg-[#FAF7F0] border border-[#D8D2C2] rounded-lg px-3 py-2 text-sm text-[#4A4947] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B17457] transition"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-[#B17457] border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Book Cards */}
          <div className="p-2">
            {/* Header with view toggle */}
            <div className="flex justify-center items-center mb-4">
              {/* <h2 className="text-xl font-semibold text-[#4A4947]">
            Book Management
          </h2> */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 rounded-lg border ${
                    viewMode === "grid"
                      ? "bg-[#B17457] text-white"
                      : "bg-white text-[#4A4947] border-[#D8D2C2]"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1 rounded-lg border ${
                    viewMode === "table"
                      ? "bg-[#B17457] text-white"
                      : "bg-white text-[#4A4947] border-[#D8D2C2]"
                  }`}
                >
                  Table
                </button>
              </div>
            </div>

            {/* Content */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-fit m-auto">
                {currentBooks.map((book) => {
                  const user = users.find((user) => user.id === book.ownerId);
                  if (!user) return null;
                  return (
                    <BookCard
                      key={book.id}
                      book={book}
                      user={user}
                      changeApproval={changeApproval}
                      deleteBook={deleteBook}
                    />
                  );
                })}
              </div>
            ) : (
              <BookTable
                books={currentBooks}
                changeApproval={changeApproval}
                deleteBook={deleteBook}
              />
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              className="btn btn-xs  rounded-lg py-4 px-3.5 text-sm bg-[#B17457] text-white hover:bg-[#9c604a]"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <img src="src/assets/h174.svg" alt="" />
            </button>

            <span className="text-sm font-medium text-[#4A4947]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="btn btn-xs rounded-lg py-4 px-3.5 text-sm bg-[#B17457] text-white hover:bg-[#9c604a]"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              <img src="src/assets/h177.svg" alt="" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
