import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "react-toastify";
// import { useEffect, useState } from "react";

export default function UserCard({ user, books, fetchUsers, openModal }) {
  // console.log(books);
  const toggleBanUser = async (userId, currentStatus) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isBanned: !currentStatus,
      });
      fetchUsers();
      toast.success(
        `User ${!user.isBanned ? "Banned" : "Un Banned"} successfully`
      );
    } catch (error) {
      console.error("Error updating user ban status:", error);
    }
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg p-6 sm:w-80 bg-white shadow-sm overflow-x-hidden">
      {/* User Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="avatar">
          <div className="w-12 rounded-full bg-gray-200">
            <img src={user.photoUrl} alt="" srcSet="" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral">{user.name}</h2>
          <p className="text-neutral text-sm">{user.email}</p>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2 mb-3">
        <span className="px-2 py-1 text-xs font-medium rounded border border-gray-300 text-neutral bg-secondary">
          {user.role == "reader" ? "Individual" : "Library"}
        </span>
      </div>

      {/* Stats Row */}
      <div className="flex justify-around mb-3">
        <div className="text-center text-neutral">
          <p className="text-xs">Books Listed</p>
          <p className="font-semibold">{books.length}</p>
        </div>
        {/* <div className="text-center text-neutral">
          <p className="text-xs">Trades</p>
          <p className="font-semibold">128</p>
        </div> */}
        <div className="text-center text-neutral">
          <p className="text-xs">Rating</p>
          <p className="font-semibold">{user.averageRating}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => openModal(user)}
          className="w-full flex justify-center items-center gap-1 py-2 px-4 border border-accent text-accent rounded-lg hover:bg-primary-content transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          View Profile
        </button>
        <button
          onClick={() => toggleBanUser(user.id, user.isBanned)}
          className="w-full flex justify-center gap-1 items-center py-2 px-4 bg-accent text-primary-content rounded-lg hover:brightness-110  transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
          {user.isBanned ? "Unban Account" : "Ban Account"}
        </button>
      </div>
    </div>
  );
}
