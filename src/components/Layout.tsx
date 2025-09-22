import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Settings, Wrench } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Book Service', href: '/book', icon: Wrench },
    { name: 'My Bookings', href: '/bookings', icon: Calendar },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Wrench className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">BikeRepair</span>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
          <div className="grid grid-cols-4 py-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center py-2 px-1 text-xs ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <item.icon className={`h-6 w-6 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className="mt-1">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}