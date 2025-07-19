import { useState } from "react";
import Header from "../components/Header";
import UserManagement from "./UserManagement";
import ManageBooks from "./ManageBooks";
import MonitorTransactions from "./MonitorTransactions";

export default function AdminLayout() {
  const [activePage, setActivePage] = useState(1);
  return (
    <div className="px-8 py-4 bg-[#FAF7F0] min-h-lvh">
      <Header activePage={activePage} changeActivePage={setActivePage} />
      {activePage == 1 ? (
        <UserManagement />
      ) : activePage == 2 ? (
        <ManageBooks />
      ) : (
        <MonitorTransactions />
      )}
    </div>
  );
}
