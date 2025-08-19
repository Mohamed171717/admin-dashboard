import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "react-toastify";

export default function UserCard({ user, books, fetchUsers, openModal }) {
  const toggleBanUser = async (userId, currentStatus) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isBanned: !currentStatus,
      });
      toggleIsDeltedBooks(userId, currentStatus);
      fetchUsers();
      toast.success(
        `${user.name} ${!user.isBanned ? "Banned" : "Un Banned"} successfully`
      );
    } catch (error) {
      console.error("Error updating user ban status:", error);
    }
  };

  const toggleIsDeltedBooks = async (userId, currentStatus) => {
    try {
      const booksQuery = query(
        collection(db, "books"),
        where("ownerId", "==", userId)
      );
      const booksSnapshot = await getDocs(booksQuery);
      if (!booksSnapshot.empty) {
        const batch = writeBatch(db);

        booksSnapshot.forEach((bookDoc) => {
          batch.update(bookDoc.ref, { isDeleted: !currentStatus });
        });

        await batch.commit();
      }
    } catch (error) {
      console.error("Error updating user books status:", error);
    }
  };

  const userDefaultImage = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.1}
      stroke="#B17457"
      className="size-6 w-12 h-12 rounded-full mx-auto object-cover"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );

  return (
    <div className="border border-[#D8D2C2] rounded-2xl p-6 bg-[#FAF7F0] shadow-sm transition transform hover:scale-[1.01] hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="avatar">
          {!user.photoUrl || user.photoUrl == "/user-default.jpg" ? (
            userDefaultImage
          ) : (
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D8D2C2]">
              <img src={user.photoUrl} alt="" />
            </div>
          )}
        </div>
        <div className="overflow-hidden">
          <h2 className="text-lg font-semibold text-[#4A4947] truncate">
            {user.name}
          </h2>
          <p className="text-sm text-[#4A4947]/70 truncate">{user.email}</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mb-3">
        <span className="px-2 py-1 text-xs font-medium rounded-lg border border-[#D8D2C2] bg-[#fff] text-[#4A4947]">
          {user.role === "reader" ? "Individual" : "Library"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 text-center text-[#4A4947] mb-4">
        <div>
          <p className="text-xs">Books</p>
          <p className="font-semibold">{books.length}</p>
        </div>
        <div>
          <p className="text-xs">Rating</p>
          <p className="font-semibold">{user.averageRating.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs">Status</p>
          <p
            className={`font-semibold ${
              user.isBanned ? "text-red-600" : "text-green-600"
            }`}
          >
            {user.isBanned ? "Banned" : "Active"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => openModal(user)}
          className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-[#B17457] text-[#B17457] rounded-lg hover:bg-[#B17457]/10 transition"
        >
          More Info
        </button>
        {/* <button
          onClick={() => toggleBanUser(user.id, user.isBanned)}
          className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-[#B17457] text-white rounded-lg hover:bg-[#9c604a] transition"
        >
          {user.isBanned ? "Unban Account" : "Ban Account"}
        </button> */}
      </div>
    </div>
  );
}
