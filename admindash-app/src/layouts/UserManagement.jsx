import UserCard from "../components/users/UserCard.jsx";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase.js";
import UserModal from "../components/users/UserModal.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserManagement() {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "" });
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const fetchData = async () => {
    try {
      // fetching books
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksData);
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
    setCurrentPage(1);
    //
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 500); // 500ms delay
    return () => clearTimeout(handler);
  }, [searchInput, filters.search]);
  // console.log(users);

  // filtering by search
  const filteredUsers = users.filter((user) => {
    const searchTerm = filters.search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm)
    );
  });

  //pagination values
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <>
      <h2 className="mb-4 text-neutral font-semibold">Manage Users</h2>
      <div className="bg-secondary rounded-2xl p-6 min-h-[470px]">
        <div className="bg-primary-content rounded-lg mb-4 flex gap-2 pr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 m-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <input
            type="search"
            name=""
            id=""
            className="w-full outline-none"
            placeholder="search users ..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div
          className={`flex gap-2 justify-between flex-wrap xl:flex-nowrap sm:justify-center ${
            currentUsers > 3 && "lg:justify-between"
          }`}
        >
          {currentUsers.map((user) => {
            const relatedBooks = books.filter(
              (book) => user.id === book.ownerId
            );
            if (!relatedBooks) return null;
            console.log(users);
            return (
              <UserCard
                key={user.id}
                user={user}
                fetchUsers={fetchData}
                books={relatedBooks}
                openModal={openModal}
              />
            );
          })}
        </div>
        <UserModal
          isModalOpen={isModalOpen}
          selectedUser={selectedUser}
          closeModal={closeModal}
        />
        {/* toatsify */}
        <ToastContainer position="top-right" autoClose={2000} />
        {/* pagination */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            className="btn btn-xs  rounded-lg py-4 px-3.5 text-sm bg-[#B17457] text-white hover:bg-[#9c604a]"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            <img src="src/assets/h174.svg" alt="<" />
          </button>

          <span className="text-sm font-medium text-[#4A4947]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-xs rounded-lg py-4 px-3.5 text-sm bg-[#B17457] text-white hover:bg-[#9c604a]"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            <img src="src/assets/h177.svg" alt=">" />
          </button>
        </div>
      </div>
    </>
  );
}
