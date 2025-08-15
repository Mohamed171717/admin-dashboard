import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

/**
 * Send notification to book owner when their book is approved
 * @param {BookType} book - The approved book
 */
// export async function sendBookApprovedNotification(book) {
//   try {
//     const notificationsRef = collection(db, "notifications");

//     const notification = {
//       reciverId: book.ownerId,
//       title: "Book Approved",
//       type: "book_approved",
//       message: `Your book "${book.title}" has been approved and is now available in the shop.`,
//       timestamp: Timestamp.now(),
//     };

//     await addDoc(notificationsRef, notification);
//     return { success: true };
//   } catch (error) {
//     console.error("Error sending approval notification:", error);
//     return { success: false, error: error.message };
//   }
// }

/**
 * Send notification to book owner when their book is rejected
 * @param {BookType} book - The rejected book
 */
export async function sendBookRejectedNotification(book) {
  try {
    const notificationsRef = collection(db, "notifications");

    const notification = {
      reciverId: book.ownerId,
      title: "Book Rejected",
      type: "book_rejected",
      message: `Your book "${book.title}" has been rejected. Please review our guidelines and try again.`,
      timestamp: Timestamp.now(),
    };

    await addDoc(notificationsRef, notification);
    return { success: true };
  } catch (error) {
    console.error("Error sending rejection notification:", error);
    return { success: false, error: error.message };
  }
}
