import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Settings, Wrench, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Book Service', href: '/book', icon: Wrench },
    { name: 'My Bookings', href: '/bookings', icon: Calendar },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

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
              
              {/* Desktop Navigation */}
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        isActive
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {user && (
              <div className="flex items-center">
                {/* Desktop User Menu */}
                <div className="hidden md:flex md:items-center md:space-x-4">
                  <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </button>
                </div>
                
                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile menu */}
          {showMobileMenu && user && (
            <div className="md:hidden">
              <div className="pt-2 pb-3 space-y-1">
                <div className="flex items-center px-4 py-2">
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-primary-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
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
                  onClick={() => setShowMobileMenu(false)}
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