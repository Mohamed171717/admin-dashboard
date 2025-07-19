import React from "react";

export default function UserModal({ isModalOpen, selectedUser, closeModal }) {
  return (
    isModalOpen &&
    selectedUser && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
            onClick={closeModal}
          >
            ✕
          </button>
          <h3 className="text-lg font-bold mb-2">User Profile</h3>
          <p>
            <strong>Name:</strong> {selectedUser.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Role:</strong> {selectedUser.role || "N/A"}
          </p>
        </div>
      </div>
    )
  );
}
