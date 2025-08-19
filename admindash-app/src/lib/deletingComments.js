// utils/deleteUserComments.js
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "react-toastify";
// import { db } from "@/firebase";

export const deleteUserComments = async (userId, name) => {
  try {
    const postsRef = collection(db, "posts");
    const postsSnapshot = await getDocs(postsRef);

    const deletePromises = [];

    for (const postDoc of postsSnapshot.docs) {
      const commentsRef = collection(db, "posts", postDoc.id, "comments");
      const q = query(commentsRef, where("userId", "==", userId));
      const commentsSnapshot = await getDocs(q);

      commentsSnapshot.forEach((commentDoc) => {
        deletePromises.push(
          deleteDoc(doc(db, "posts", postDoc.id, "comments", commentDoc.id))
        );
      });
    }

    await Promise.all(deletePromises);
    console.log("All comments deleted successfully");
    toast.success(`${name}'s comments deleted successfully`, {
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
    console.error("Error deleting user comments:", error);
    throw error;
  }
};
