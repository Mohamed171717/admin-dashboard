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

// const dummyBooks = [
//   {
//     id: 1,
//     title: "The Art of Programming",
//     author: "Robert C. Martin",
//     isbn: "978-0132350884",
//     image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
//     submittedBy: {
//       name: "John Smith",
//       email: "john.smith@library.com",
//     },
//     source: "Library",
//     status: "Approved",
//     date: "2024-01-15",
//   },
//   {
//     id: 2,
//     title: "Design Patterns",
//     author: "Erich Gamma",
//     isbn: "978-0201633610",
//     image: "https://images.unsplash.com/photo-1581093458791-9c10c8a14f6e",
//     submittedBy: {
//       name: "Sarah Johnson",
//       email: "sarah.j@gmail.com",
//     },
//     source: "Individual",
//     status: "Pending",
//     date: "2024-01-16",
//   },
//   {
//     id: 3,
//     title: "Clean Architecture",
//     author: "Robert C. Martin",
//     isbn: "978-0134494166",
//     image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
//     submittedBy: {
//       name: "Michael Brown",
//       email: "m.brown@library.com",
//     },
//     source: "Library",
//     status: "Rejected",
//     date: "2024-01-17",
//   },
//   {
//     id: 4,
//     title: "Refactoring",
//     author: "Martin Fowler",
//     isbn: "978-0201485677",
//     image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
//     submittedBy: {
//       name: "Emma Green",
//       email: "emma.green@library.com",
//     },
//     source: "Library",
//     status: "Pending",
//     date: "2024-01-18",
//   },
// ];

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  const fetchData = async () => {
    try {
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
      console.log(booksData);
      // fetching users
      const querySnapshot2 = await getDocs(collection(db, "users"));
      const usersData = querySnapshot2.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
    //
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setCurrentPage(1);
    }, 1000);
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
      console.log("Updated Firestore successfully");
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
    return searchMatch;
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
      <div className="flex flex-wrap justify-start items-center gap-3 mb-4">
        <div className="bg-white border-secondary border rounded-lg flex gap-2 pr-2 flex-2 min-w-3xs">
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
      </div>

      {/* Book Cards */}
      <div
        // className={`flex gap-4 flex-wrap justify-center ${
        //   filteredBooks.length > 2 && "lg:justify-between"
        // }`}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-fit m-auto"
      >
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
    </div>
  );
}
