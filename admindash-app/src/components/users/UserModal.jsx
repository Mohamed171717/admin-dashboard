import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function UserModal({ isModalOpen, selectedUser, closeModal }) {
  if (!isModalOpen || !selectedUser) return null;

  const {
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

  console.log(createdAt.toDate());
  console.log(new Date(updatedAt));
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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
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
          {!photoUrl || photoUrl == "/user-default.jpg" ? (
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
        {averageRating !== undefined && (
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
            <h3 className="text-sm font-semibold text-[#4A4947] mb-1">Bio:</h3>
            <p className="text-sm text-gray-600">{bio}</p>
          </div>
        )}

        {/* Genres */}
        {genres.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-[#4A4947] mb-1">
              Genres:
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre, index) => (
                <span
                  key={index}
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
      </div>
    </div>
  );
}
