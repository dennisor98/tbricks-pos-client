import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  Settings,
  Home,
  Receipt,
  TrendingUp,
  Building2
} from 'lucide-react';
import { AuthService } from '../services/auth';

const Sidebar: React.FC = () => {
  const isSuperUser = AuthService.isSuperUser();
  
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/pos', icon: ShoppingCart, label: 'Point of Sale' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/sales', icon: Receipt, label: 'Sales' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/customers', icon: Users, label: 'Customers' },
    ...(isSuperUser ? [{ path: '/tenants', icon: Building2, label: 'Tenants' }] : []),
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">POS System</h1>
            <p className="text-xs text-gray-500">Modern Retail Management</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
