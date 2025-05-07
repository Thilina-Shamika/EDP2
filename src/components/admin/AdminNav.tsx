'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Home,
  Building2,
  Building,
  FileText,
  Calculator,
  MessageSquare,
  FileEdit,
  LogOut,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Add Buy', path: '/admin/add-buy', icon: Home },
  { name: 'Manage Buy', path: '/admin/manage-buy', icon: Home },
  { name: 'Add Commercial', path: '/admin/add-commercial', icon: Building2 },
  { name: 'Manage Commercial', path: '/admin/manage-commercial', icon: Building2 },
  { name: 'Add Off Plan', path: '/admin/add-off-plan', icon: Building },
  { name: 'Manage Off Plan', path: '/admin/manage-off-plan', icon: Building },
  { name: 'Listed Properties', path: '/admin/listed-properties', icon: FileText },
  { name: 'Mortgage Consulting', path: '/admin/mortgage-consulting', icon: Calculator },
  { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
  { name: 'Property Requests', path: '/admin/property-requests', icon: FileText },
  { name: 'Add Blog', path: '/admin/add-blog', icon: FileEdit },
  { name: 'Manage Blog', path: '/admin/manage-blog', icon: FileEdit },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut()}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </nav>
  );
} 