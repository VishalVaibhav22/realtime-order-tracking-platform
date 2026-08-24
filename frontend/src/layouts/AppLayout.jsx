import { Outlet, NavLink } from "react-router-dom";
import { SquaresFour, Package, UserCircle, SignOut, Truck } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = {
  CUSTOMER: [
    { to: "/customer", label: "Dashboard", icon: SquaresFour, end: true },
    { to: "/customer/orders", label: "Orders", icon: Package },
  ],
  DRIVER: [{ to: "/driver", label: "Dashboard", icon: SquaresFour, end: true }],
  ADMIN: [
    { to: "/admin", label: "Dashboard", icon: SquaresFour, end: true },
    { to: "/admin/orders", label: "Orders", icon: Package },
    { to: "/admin/drivers", label: "Drivers", icon: Truck },
  ],
};

function navLinkClass({ isActive }) {
  return `flex items-center gap-3 px-4 py-2.5 rounded text-sm font-semibold transition-colors ${
    isActive ? "bg-primary/5 text-primary" : "text-text-secondary hover:bg-background"
  }`;
}

function mobileNavLinkClass({ isActive }) {
  return `flex flex-col items-center gap-0.5 text-[11px] font-medium ${
    isActive ? "text-primary" : "text-text-secondary"
  }`;
}

function AppLayout() {
  const { user, logout } = useAuth();
  const items = NAV_ITEMS[user.role] || [];

  return (
    <div className="min-h-screen bg-background md:flex">
      <nav className="hidden md:flex flex-col w-[280px] shrink-0 border-r border-border bg-surface p-4 fixed h-screen">
        <div className="mb-8 px-4 pt-2">
          <h1 className="text-2xl font-bold text-primary tracking-[0.1em]">SWAY</h1>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
        <div className="flex flex-col gap-1 border-t border-border pt-3">
          <NavLink to="/profile" className={navLinkClass}>
            <UserCircle size={20} />
            Profile
          </NavLink>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-semibold text-text-secondary hover:bg-background text-left"
          >
            <SignOut size={20} />
            Log out
          </button>
        </div>
      </nav>

      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-surface sticky top-0 z-30">
        <h1 className="text-xl font-bold text-primary tracking-[0.1em]">SWAY</h1>
        <button onClick={logout}>
          <SignOut size={20} className="text-text-secondary" />
        </button>
      </header>

      <main className="flex-1 min-w-0 md:ml-[280px] pb-16 md:pb-0">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-surface border-t border-border z-30">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={mobileNavLinkClass}>
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
        <NavLink to="/profile" className={mobileNavLinkClass}>
          <UserCircle size={22} />
          Profile
        </NavLink>
      </nav>
    </div>
  );
}

export default AppLayout;
