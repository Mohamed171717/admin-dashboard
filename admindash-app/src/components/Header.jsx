import { useState } from "react";

export default function Header({ activePage, changeActivePage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (pageNum, label, icon) => (
    <button
      className={`flex gap-1 p-2 items-center ${
        activePage === pageNum && "text-accent border-b-accent border-b-2"
      }`}
      onClick={() => {
        changeActivePage(pageNum);
        setMenuOpen(false);
      }}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="text-center">
      <div className="p-3 bg-secondary rounded-2xl mb-4">
        {/* Top bar */}
        <div className="flex justify-center items-center md:justify-center md:gap-14">
          {/* Burger Icon - visible only on small screens */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-neutral"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <div
          className={`flex flex-col md:flex-row md:gap-14 md:justify-center transition-all duration-200 ${
            menuOpen ? "block" : "hidden"
          } md:flex`}
        >
          {navLink(
            1,
            "Manage Users",
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={activePage === 1 ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          )}

          {navLink(
            2,
            "Manage Books",
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={activePage === 2 ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          )}

          {navLink(
            3,
            "Monitor Transactions",
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={activePage === 3 ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
