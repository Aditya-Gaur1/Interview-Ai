import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const UserMenu = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const name =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  const initial = name.charAt(0).toUpperCase();

  const logout = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2.5 px-2 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
          {initial}
        </div>

        {/* Name */}
        <span className="hidden sm:block text-sm text-gray-300 max-w-[120px] truncate">
          {name}
        </span>

        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50 overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-sm font-medium text-white truncate">
              {name}
            </p>

            {user?.email && (
              <p className="text-xs text-gray-500 truncate mt-1">
                {user.email}
              </p>
            )}
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="w-full cursor-pointer px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
            </svg>

            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;