import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";

/**
 * Send notifications to book owner and users with matching genre interests
 * @param {BookType} book - The book object
 */
export async function sendBookNotifications(book) {
  try {
    const notificationsRef = collection(db, "notifications");
    const usersRef = collection(db, "users");

    // Query users who are interested in this book's genre
    const usersQuery = query(
      usersRef,
      where("genres", "array-contains", book.genre)
    );

    const usersSnapshot = await getDocs(usersQuery);
    const notificationPromises = [];

    // Create notification for book owner
    const ownerNotification = {
      reciverId: book.ownerId,
      title: "Book Approved",
      type: "book_approved",
      message: `Your book "${book.title}" has been approved by admin and is now available in the shop.`,
      timestamp: Timestamp.now(),
    };

    notificationPromises.push(addDoc(notificationsRef, ownerNotification));

    // Create notifications for users with matching genres (excluding owner)
    usersSnapshot.forEach((userDoc) => {
      if (userDoc.id !== book.ownerId) {
        const notification = {
          reciverId: userDoc.id,
          title: "New Book Available",
          type: "book_approved",
          senderId: book.ownerId,
          message: `A new book "${book.title}" in ${book.genre} genre is now available!`,
          timestamp: Timestamp.now(),
        };
        notificationPromises.push(addDoc(notificationsRef, notification));
      }
    });

    // Send all notifications
    await Promise.all(notificationPromises);

    return { success: true };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return { success: false, error: error.message };
  }
}
