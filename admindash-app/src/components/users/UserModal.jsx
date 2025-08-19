import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { FaRegStar, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";
import { deleteUserPosts } from "@/lib/deletingPosts";
import { deleteUserComments } from "@/lib/deletingComments";

export default function UserModal({
  isModalOpen,
  selectedUser,
  closeModal,
  fetchUsers,
}) {
  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  if (!isModalOpen || !selectedUser) return null;

  const {
    uid,
    name,
    email,
    role,
    photoUrl,
    bio,
    genres = [],
    averageRating,
    verified,
    isBanned,
    profileIncomplete,
    createdAt,
    updatedAt,
  } = selectedUser;
  const id = uid;

  const openConfirm = ({ title, message, onConfirm }) =>
    setConfirm({ open: true, title, message, onConfirm });

  const closeConfirm = () =>
    setConfirm({ open: false, title: "", message: "", onConfirm: null });

  //
  const userDefaultImage = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.1}
      stroke="#B17457"
      className="size-6 w-20 h-20 rounded-full mx-auto mb-2 object-cover"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );

  const toggleBanUser = async (userId, currentStatus) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isBanned: !currentStatus,
      });
      toggleIsDeltedBooks(userId, currentStatus);
      fetchUsers();
      closeModal();
      toast.success(
        `${selectedUser.name} ${
          !selectedUser.isBanned ? "Banned" : "Un Banned"
        } successfully`
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

  return (
    <>
      {/* Main modal */}
      <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center">
        <div className="bg-[#FAF7F0] rounded-xl p-6 w-[90%] max-w-lg shadow-xl relative">
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-[#4A4947] hover:text-[#B17457] text-xl"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center">
            {!photoUrl || photoUrl === "/user-default.jpg" ? (
              userDefaultImage
            ) : (
              <img
                src={photoUrl}
                alt={name}
                className="w-24 h-24 rounded-full mx-auto mb-2 border-4 border-[#D8D2C2] object-cover"
              />
            )}
            <h2 className="text-xl font-semibold text-[#4A4947]">{name}</h2>
            <p className="text-sm text-gray-500">{email}</p>
          </div>

          {/* Rating */}
          {typeof averageRating === "number" && (
            <div className="flex justify-center mt-2 text-yellow-500 text-sm">
              {Array.from({ length: 5 }, (_, i) =>
                i < Math.round(averageRating) ? (
                  <FaStar key={i} />
                ) : (
                  <FaRegStar key={i} />
                )
              )}
            </div>
          )}

          {/* Bio */}
          {bio && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-[#4A4947] mb-1">
                Bio:
              </h3>
              <p className="text-sm text-gray-600">{bio}</p>
            </div>
          )}

          {/* Genres */}
          {!!genres.length && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-[#4A4947] mb-1">
                Genres:
              </h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre, idx) => (
                  <span
                    key={`${genre}-${idx}`}
                    className="bg-[#D8D2C2] text-[#4A4947] px-3 py-1 rounded-full text-xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status info */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-medium text-[#4A4947]">Role:</p>
              <p>{role || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium text-[#4A4947]">Verified:</p>
              <p>{verified ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="font-medium text-[#4A4947]">Banned:</p>
              <p>{isBanned ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="font-medium text-[#4A4947]">Profile:</p>
              <p>{profileIncomplete ? "Incomplete" : "Complete"}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="mt-4 text-xs text-gray-400 text-center">
            {createdAt && (
              <p>Created: {createdAt.toDate().toLocaleDateString()}</p>
            )}
            {updatedAt && (
              <p>Updated: {updatedAt.toDate().toLocaleDateString()}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col gap-3">
            {/* Ban/Unban with dialog */}
            <button
              onClick={() =>
                openConfirm({
                  title: isBanned ? "Unban user?" : "Ban user?",
                  message: isBanned
                    ? "This will restore the user's access."
                    : "This will revoke the user's access and hide their listings.",
                  onConfirm: () => toggleBanUser(id, isBanned),
                })
              }
              className="flex-1 px-4 py-2 rounded-lg font-medium transition bg-[#B17457] text-white hover:bg-[#9c604a]"
            >
              {isBanned ? "Unban User" : "Ban User"}
            </button>

            <div className="flex justify-between gap-4">
              {/* Delete Posts */}
              <button
                onClick={() =>
                  openConfirm({
                    title: "Delete all posts?",
                    message:
                      "All book posts created by this user will be permanently removed.",
                    onConfirm: () => deleteUserPosts(id, name),
                  })
                }
                className="flex-1 px-4 py-2 rounded-lg font-medium bg-[#D8D2C2] text-[#4A4947] hover:bg-[#acaaa7] hover:text-white transition"
              >
                Delete Posts
              </button>

              {/* Delete Comments */}
              <button
                onClick={() =>
                  openConfirm({
                    title: "Delete all comments?",
                    message:
                      "All comments written by this user will be permanently removed.",
                    onConfirm: () => deleteUserComments(id, name),
                  })
                }
                className="flex-1 px-4 py-2 rounded-lg font-medium bg-[#D8D2C2] text-[#4A4947] hover:bg-[#acaaa7] hover:text-white transition"
              >
                Delete Comments
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable confirm dialog */}
      {confirm.open && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[92%] max-w-sm">
            <h3 className="text-lg font-semibold text-[#4A4947]">
              {confirm.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{confirm.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirm.onConfirm?.();
                  closeConfirm();
                }}
                className="px-4 py-2 rounded-lg bg-[#B17457] text-white hover:bg-[#9c604a] transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
