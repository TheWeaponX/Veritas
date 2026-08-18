import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, User } from 'lucide-react';
import Header from './Header';

const links = [
  { to: '/dashboard', label: 'Meus artigos', icon: LayoutDashboard, end: true },
  { to: '/dashboard/perfil', label: 'Perfil', icon: User },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 flex gap-10">
        <aside className="hidden md:flex flex-col gap-1 w-48 shrink-0">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm px-3 py-2 rounded-sm ${
                  isActive ? 'bg-ink-900 text-paper-50' : 'text-ink-700 hover:bg-ink-50'
                }`
              }
            >
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </aside>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
