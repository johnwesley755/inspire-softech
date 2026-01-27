import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FolderTree, BarChart3, LogOut, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Sellers', path: '/sellers', icon: Users },
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-gray-900 leading-none">ShopHub</h1>
            <p className="text-xs text-purple-600 font-medium mt-1">Super Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-purple-50 text-purple-600 shadow-sm" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-purple-600" : "text-gray-400 group-hover:text-gray-600")} />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group">
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
