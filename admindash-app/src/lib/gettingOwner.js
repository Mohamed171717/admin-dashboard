import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getBookOwner = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.error("Book owner not found");
      return null;
    }

    // Return the user data with the uid
    return {
      ...userDoc.data(),
      uid: userDoc.id,
    };
  } catch (error) {
    console.error("Error getting book owner:", error);
    return null;
  }
};
