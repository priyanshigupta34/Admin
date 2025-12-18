import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, ChevronDown, ChevronRight, Shield, Search, Bell } from "lucide-react"; 


export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white min-h-screen hidden md:block shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-0 w-40 h-40 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="p-6 border-b border-white/20 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="font-bold text-lg">Builder Owner</div>
              <div className="text-xs text-blue-200">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="p-4 flex flex-col justify-between h-[calc(100vh-96px)] relative z-10">
          <div className="space-y-1">
            <SidebarLink to="/admin/dashboard" label="Home " rightIcon />
            <SidebarLink
              // to="/admin/users"
              label="Users"
              submenu={[
                { label: "Manage User", to: "/admin/users/manage" },
                { label: "Add User", to: "/admin/users/add" },
                { label: "Edit User", to: "/admin/users/edit" },
                { label: "Delete User", to: "/admin/users/delete" },
                { label: "Update User", to: "/admin/users/update" },
              ]}
            />
            <SidebarLink
              // to="/admin/data"
              label="Data"
              submenu={[
                { label: "Manage Data", to: "/admin/data/manage" },
                { label: "Add Data", to: "/admin/data/add" },
                { label: "Edit Data", to: "/admin/data/edit" },
                { label: "Delete Data", to: "/admin/data/delete" },
                { label: "Update Data", to: "/admin/data/update" },
              ]}
            />
            <SidebarLink
              // to="/admin/subscription"
              label="Subscriptions"
              submenu={[
                // { label: "Add Subscription",to:"/admin/subscription/create-subscription"},
                // { label: "Edit Subscription",to:"/admin/subscription/update-subscription"},
                { label: "Manage Subscription",to:"/admin/subscription/manage-subscription"},
             
              ]}
            />
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
            >
            </NavLink>
          </div>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 min-h-screen">{children}</main>
      </div>
    </div>
  );
}

/* Sidebar link  */
function SidebarLink({ to, label, submenu, rightIcon }) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef();

  function handleEnter() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  }

  function handleLeave() {
    // small delay so user can move mouse to the dropdown without it flickering
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 150);
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          "flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all duration-200 " +
          (isActive ? "bg-white/20 text-white font-semibold shadow-lg backdrop-blur-sm" : "text-white/90 hover:bg-white/10 hover:shadow-md")
        }
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold shadow-md">{label[0]}</span>
          <span>{label}</span>
        </div>

        {rightIcon ? (
          <ChevronRight size={14} className="text-white/80 ml-2" />
        ) : submenu ? (
          <ChevronDown
            size={14}
            className={"text-white/80 ml-2 transition-transform duration-200 " + (open ? "rotate-180" : "")}
          />
        ) : null}
      </NavLink>

      {submenu && open && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-white/95 backdrop-blur-lg text-gray-800 rounded-lg shadow-2xl z-20 pointer-events-auto border border-blue-100">
          <div className="py-1">
            {submenu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  "block px-4 py-2 text-sm transition-all duration-200 rounded-md mx-1 " + (isActive ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-md" : "text-gray-700 hover:bg-blue-50")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* Topbar  */
function Topbar() {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef();

  function handleEnter() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 150);
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Admin</h1>
        <p className="text-sm text-gray-600 hidden md:block">User Management and Other Operations...</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
          <input
            type="search"
            placeholder="Search users, orders, products..."
            className="pl-10 pr-4 py-2 border border-blue-200 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
          />
        </div>

        <button 
          type="button"
          className="relative p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 text-blue-600"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
        </button>

        <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          <button aria-label="Profile" type="button" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-blue-100 bg-white shadow-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
              <User size={16} className="text-white" />
            </div>
            <ChevronDown size={14} className="text-gray-600" />
          </button>

          {open && (
            <div className="absolute right-0  w-44 bg-white/95 backdrop-blur-lg border border-blue-100 rounded-lg shadow-xl text-sm z-30 pointer-events-auto">
              <div className="py-1">
                <NavLink to="/admin/profile" className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-200 text-gray-700 rounded-md mx-1">Profile</NavLink>
                <NavLink to="/admin/settings" className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-200 text-gray-700 rounded-md mx-1">Settings</NavLink>
                <div className="border-t border-blue-100 my-1"></div>
                <button
                  onClick={() => console.log("logout")}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors duration-200 text-red-600 rounded-md mx-1 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}