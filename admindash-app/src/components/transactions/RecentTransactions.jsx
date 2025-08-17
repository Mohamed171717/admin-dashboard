// src/components/RecentTransactions.jsx
import { FaExchangeAlt, FaShoppingCart, FaUniversity } from "react-icons/fa";
import { formatDate } from "../../lib/utils";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect, useState } from "react";

export default function RecentTransactions({ transactions }) {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      // fetching books
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          docId: doc.id,
          id: data.id,
        };
      });
      setBooks(booksData);
      console.log(booksData);
      // fetching users
      const querySnapshot2 = await getDocs(collection(db, "users"));
      const usersData = querySnapshot2.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const filteredBook = (bookId) => {
    return books.find((book) => book.id === bookId);
  };

  const filteredUser = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Unknown User";
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-base-100 rounded-xl pt-3 shadow-sm">
      <div className="flex justify-between items-center mb-3 px-4">
        <h2 className="text-lg font-semibold text-neutral">Transactions</h2>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <table className="table w-full border-collapse">
          <thead className="bg-[#D8D2C2] text-[#4A4947]">
            <tr className="text-center">
              <th className="sticky top-0 bg-[#D8D2C2] z-10 text-left">
                Date & Time
              </th>
              <th className="sticky top-0 bg-[#D8D2C2] z-10">Seller</th>
              <th className="sticky top-0 bg-[#D8D2C2] z-10">Sold Books</th>
              <th className="sticky top-0 bg-[#D8D2C2] z-10">Quantity</th>
              <th className="sticky top-0 bg-[#D8D2C2] z-10 ">Price</th>
              <th className="sticky top-0 bg-[#D8D2C2] z-10 text-left">
                Buyer
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const sellerNames = [];
              const bookTitles = [];
              const quantities = [];
              const prices = [];

              tx.items.forEach((item) => {
                const book = filteredBook(item.bookId);
                sellerNames.push(book ? filteredUser(book.ownerId) : "Unknown");
                bookTitles.push(item.title);
                quantities.push(item.quantity);
                prices.push(item.price);
              });

              return (
                <tr
                  key={tx.orderId}
                  className="border-t text-sm text-[#4A4947] align-top"
                >
                  {/* Date & Time */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div>{formatDate(tx.createdAt)}</div>
                    <div className="text-xs text-gray-500">{tx.time}</div>
                  </td>

                  {/* Seller */}
                  <td className="py-3 px-4 text-center">
                    {sellerNames.map((name, idx) => (
                      <div key={idx} className="whitespace-nowrap">
                        {name}
                      </div>
                    ))}
                  </td>

                  {/* Books */}
                  <td className="py-3 px-4 text-center">
                    {bookTitles.map((title, idx) => (
                      <div key={idx} className="whitespace-nowrap">
                        {title}
                      </div>
                    ))}
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 text-center">
                    {quantities.map((q, idx) => (
                      <div key={idx}>{q}</div>
                    ))}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-center font-semibold">
                    {prices.map((p, idx) => (
                      <div key={idx}>{p}</div>
                    ))}
                  </td>

                  {/* Buyer */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {filteredUser(tx.userId)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
