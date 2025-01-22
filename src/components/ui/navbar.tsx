import { Link } from "react-router-dom";
import ThemeController from "./themeController";

export default function Navbar() {
  return (
    <div className="navbar bg-[#1E0F75] dark:bg-red-400 md:pr-40 md:pl-40 shadow-md">
      <div className="flex-1">
        <a
          className="btn btn-ghost font-bold text-2xl dark:text-white text-[#FFA552]"
          href="/dashboard"
        >
          ProjectSync
        </a>
      </div>
      <div className="flex-none gap-x-4">
        <div className="hidden md:flex gap-x-8 mr-8 text-xl font-semibold text-[#FFA552]">
          <div>
            <Link to="/focus-mode">
              <h1>Focus Mode</h1>
            </Link>
          </div>
          <div>
            <Link to="/leaderboard">
              <h1>Leaderboard</h1>
            </Link>
          </div>
          <div>
            <Link to="/">
              <h1>Task</h1>
            </Link>
          </div>
        </div>
        <div>
          <ThemeController />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-[#3785D8] dark:bg-gray-700 rounded-box z-[1] gap-y-2 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="dark:text-white block md:hidden">Lorem</a>
            </li>
            <li>
              <a className="dark:text-white block md:hidden">Lorem</a>
            </li>
            <li>
              <a className="dark:text-white block md:hidden">Lorem</a>
            </li>
            <li>
              <a className="dark:text-white" href="/account-setting">
                Account Settings
              </a>
            </li>
            <li>
              <a className="dark:text-white">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
