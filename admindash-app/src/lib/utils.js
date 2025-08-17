import { Timestamp } from "firebase/firestore";

export function formatDate(timestamp) {
  let date;

  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate(); // Firestore Timestamp → Date
  } else if (timestamp instanceof Date) {
    date = timestamp; // Already a JS Date
  } else {
    date = new Date(timestamp); // Number or string → Date
  }

  // Example: 2025-08-11 16:32
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
