// utils/deleteUserPosts.js
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase"; // adjust import path to your firebase config
import { toast } from "react-toastify";

export const deleteUserPosts = async (userId, name) => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map((postDoc) =>
      deleteDoc(doc(db, "posts", postDoc.id))
    );

    await Promise.all(deletePromises);
    console.log("All posts deleted successfully");

    toast.success(`${name}'s posts deleted successfully`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    return true;
  } catch (error) {
    console.error("Error deleting user posts:", error);
    throw error;
  }
};
