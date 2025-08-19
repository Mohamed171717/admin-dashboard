import UserCard from "../components/users/UserCard.jsx";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase.js";
import UserModal from "../components/users/UserModal.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserRoleChart from "@/components/users/UserRoleChart.jsx";
import { FaUsers } from "react-icons/fa";

export default function UserManagement() {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "", role: "all" });
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

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
  // const filteredUsers = users.filter((user) => {
  //   const searchTerm = filters.search.toLowerCase();
  //   return (
  //     user.name?.toLowerCase().includes(searchTerm) ||
  //     user.email?.toLowerCase().includes(searchTerm)
  //   );
  // });
  const filteredUsers = users.filter((user) => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm);

    const matchesRole =
      filters.role === "all" || user.role?.toLowerCase() === filters.role;

    return matchesSearch && matchesRole;
  });

  //pagination values
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <>
      <h2 className="mb-4 text-neutral font-semibold">Manage Users</h2>
      <div className="rounded-2xl p-6 min-h-[470px] bg-[#D8D2C2]">
        {/* === Analytics Overview === */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 mb-6 ">
          {/* Left Column: Stats Cards */}
          <div className="flex lg:flex-col flex-row gap-6 w-full">
            {/* Total Users Card */}
            <Card className="flex-1 p-6 bg-[#FAF7F0] border border-[#D8D2C2] rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#4A4947]">
                  Total Users
                </h3>
                <div className="p-2 rounded-xl bg-[#D8D2C2]">
                  <FaUsers className="text-[#B17457]" />
                </div>
              </div>

              <div className="flex items-end justify-between mt-2">
                <p className="text-4xl font-extrabold text-[#B17457]">
                  {users.length}
                </p>
                <span className="text-xs text-[#4A4947]">
                  All registered accounts
                </span>
              </div>

              {/* Small growth indicator chart (optional sparkline style) */}
              <div className="mt-1 h-2 w-full bg-[#D8D2C2] rounded-full overflow-hidden">
                <div
                  className="h-2 bg-[#B17457] rounded-full"
                  style={{
                    width: `${Math.min((users.length / 100) * 100, 100)}%`, // fake growth bar
                  }}
                />
              </div>
            </Card>

            {/* User Status Card */}
            <Card className="flex-1 p-6 bg-[#FAF7F0] border border-[#D8D2C2] rounded-2xl shadow-sm">
              <h3 className="text-sm font-medium text-[#4A4947]">
                User Status
              </h3>

              <div className="mt-1 space-y-4">
                {/* Active Users */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#4A4947]">Active</span>
                    <span className="font-semibold text-green-600">
                      {users.filter((u) => !u.isBanned).length}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#D8D2C2] rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                      style={{
                        width: `${
                          (users.filter((u) => !u.isBanned).length /
                            users.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Banned Users */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#4A4947]">Banned</span>
                    <span className="font-semibold text-red-600">
                      {users.filter((u) => u.isBanned).length}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#D8D2C2] rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                      style={{
                        width: `${
                          (users.filter((u) => u.isBanned).length /
                            users.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: User Role Chart (takes full width) */}
          <div className="flex-1">
            <Card className="p-6 bg-[#FAF7F0] border border-[#D8D2C2] rounded-2xl shadow-sm h-full">
              {/* <h3 className="text-sm font-medium text-[#4A4947] mb-4">
                User Role Breakdown
              </h3> */}
              <div className="h-[300px]">
                <UserRoleChart users={users} />
              </div>
            </Card>
          </div>
        </div>

        {/* === Search & Filter === */}
        <div className="flex gap-4 mb-4 flex-col sm:flex-row">
          {/* Search */}
          <div className="bg-primary-content rounded-lg flex gap-2 pr-2 flex-1">
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
              className="w-full outline-none"
              placeholder="search users ..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <select
            className="bg-[#FAF7F0] border border-[#D8D2C2] rounded-lg px-3 py-2 text-sm text-[#4A4947] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B17457] transition"
            value={filters.role}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, role: e.target.value }))
            }
          >
            <option value="all">All Roles</option>
            <option value="reader">Individual</option>
            <option value="library">Library</option>
          </select>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-6 bg-[#FAF7F0] m-auto">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          {/* Grid View */}
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {currentUsers.map((user) => {
                const relatedBooks = books.filter(
                  (book) => user.id === book.ownerId
                );
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
          </TabsContent>

          {/* Table View */}
          <TabsContent value="table">
            <Card className="p-4 bg-[#FAF7F0] shadow-lg rounded-2xl">
              <Table>
                <TableHeader className="bg-[#D8D2C2]">
                  <TableRow>
                    <TableHead className="text-[#4A4947] font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="text-[#4A4947] font-semibold">
                      Email
                    </TableHead>
                    <TableHead className="text-[#4A4947] font-semibold">
                      Role
                    </TableHead>
                    <TableHead className="text-[#4A4947] font-semibold">
                      Books
                    </TableHead>
                    <TableHead className="text-[#4A4947] font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-[#4A4947] font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {currentUsers.map((user, idx) => {
                    const relatedBooks = books.filter(
                      (book) => user.id === book.ownerId
                    );
                    return (
                      <TableRow
                        key={user.id}
                        className={`${
                          idx % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#F1ECE4]"
                        } hover:bg-[#E6DFD5] transition-colors`}
                      >
                        <TableCell className="text-[#4A4947]">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-[#4A4947]">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-[#4A4947]">
                          {user.role === "reader" ? "Individual" : "Library"}
                        </TableCell>
                        <TableCell className="text-[#4A4947]">
                          {relatedBooks.length}
                        </TableCell>
                        <TableCell>
                          {user.isBanned ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Banned
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Active
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded-lg text-sm font-medium border border-[#B17457] text-[#B17457] hover:bg-[#B17457] hover:text-white transition"
                            onClick={() => openModal(user)}
                          >
                            More Info
                          </button>
                          {/* <button
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              user.isBanned
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                            // onClick={() => toggleBanUser(user.id, user.isBanned)}
                          >
                            {user.isBanned ? "Unban" : "Ban"}
                          </button> */}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
        <UserModal
          isModalOpen={isModalOpen}
          selectedUser={selectedUser}
          closeModal={closeModal}
          fetchUsers={fetchData}
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
