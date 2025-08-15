import { useEffect, useState } from "react";
import LibrarySales from "../components/transactions/LibrarySales";
import RecentTransactions from "../components/transactions/RecentTransactions";
import TransactionStats from "../components/transactions/TransactionStats";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  endBefore,
  onSnapshot,
  getDocs,
  Timestamp,
  limitToLast,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export default function MonitorTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [complains, setComplains] = useState([]);
  const [pageInfo, setPageInfo] = useState({ firstDoc: null, lastDoc: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageCursors, setPageCursors] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const PAGE_SIZE = 10;

  function isToday(timestamp) {
    let date;

    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // 🔹 Fetch total count once to determine total pages
  const fetchTotalCount = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    const totalCount = snapshot.size;
    const totalTransactions = snapshot.docs.map((doc) => doc.data());
    setTotalTransactions(totalTransactions.length);
    setTotalPages(Math.ceil(totalCount / PAGE_SIZE));
  };

  const fetchData = (direction = "initial") => {
    let q;

    if (direction === "initial") {
      q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );
    } else if (direction === "next") {
      q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        startAfter(pageInfo.lastDoc),
        limit(PAGE_SIZE)
      );
    } else if (direction === "prev") {
      q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        endBefore(pageInfo.firstDoc),
        limitToLast(PAGE_SIZE) // needed for backwards pagination
      );
    }

    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
          id: doc.data().id,
        }));

        setTransactions(data);

        const firstDoc = snapshot.docs[0];
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];

        setPageInfo({ firstDoc, lastDoc });

        if (direction === "next") {
          setPageCursors((prev) => [...prev, firstDoc]);
        } else if (direction === "prev") {
          setPageCursors((prev) => prev.slice(0, -1));
        }
      }
    });
  };

  const fetchComplains = () => {
    const q = collection(db, "complains");
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
        id: doc.data().id,
      }));
      setComplains(data);
    });
  };

  useEffect(() => {
    fetchTotalCount(); // get total pages on load
    const unsubTransactions = fetchData("initial");
    const unsubComplains = fetchComplains();

    return () => {
      unsubTransactions();
      unsubComplains();
    };
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-neutral font-semibold">Monitor Transactions</h2>

      <TransactionStats
        data={{
          total: totalTransactions,
          completed: transactions.filter((t) => isToday(t.createdAt)).length,
          issues: complains.filter((c) => c.complainType === "book").length,
        }}
      />

      <RecentTransactions transactions={transactions} />

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
            fetchData("prev");
          }}
          className="btn btn-xs rounded-lg py-4 px-3.5 text-sm bg-[#B17457] text-white hover:bg-[#9c604a] disabled:opacity-50"
        >
          <img src="src/assets/h174.svg" alt="Previous" />
        </button>

        <span className="text-sm font-medium text-[#4A4947]">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
            fetchData("next");
          }}
          className="btn btn-xs rounded-lg py-4 px-3.5 text-sm bg-[#B17457] text-white hover:bg-[#9c604a] disabled:opacity-50"
        >
          <img src="src/assets/h177.svg" alt="Next" />
        </button>
      </div>
    </div>
  );
}
