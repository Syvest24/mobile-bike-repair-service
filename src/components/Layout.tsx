import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Calendar, User, Settings, Wrench, LogOut, Menu, Bell, Search, MapPin,
  X, ChevronDown, Zap, Clock, Shield, Star, Phone, MessageCircle, HelpCircle,
  CreditCard, Bike, Award, History
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
  description?: string;
  children?: NavigationItem[];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);

  // Primary navigation with improved structure
  const primaryNavigation: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: Home,
      description: 'Overview and quick actions'
    },
    { 
      name: 'Services', 
      href: '/book', 
      icon: Wrench,
      description: 'Book and manage repairs',
      children: [
        { name: 'Book Repair', href: '/book', icon: Wrench, description: 'Schedule a new service' },
        { name: 'Emergency Service', href: '/book?emergency=true', icon: Zap, description: 'Urgent repairs' },
        { name: 'Maintenance', href: '/book?type=maintenance', icon: Settings, description: 'Regular upkeep' }
      ]
    },
    { 
      name: 'My Bookings', 
      href: '/bookings', 
      icon: Calendar,
      badge: 2,
      description: 'View service history'
    }
  ];

  // Secondary navigation for user account
  const userNavigation: NavigationItem[] = [
    { name: 'Profile', href: '/profile', icon: User, description: 'Personal information' },
    { name: 'My Bikes', href: '/profile?tab=bikes', icon: Bike, description: 'Manage your bikes' },
    { name: 'Subscription', href: '/profile?tab=subscription', icon: Award, description: 'Plan and billing' },
    { name: 'Payment Methods', href: '/profile?tab=payment', icon: CreditCard, description: 'Cards and billing' },
    { name: 'Service History', href: '/bookings', icon: History, description: 'Past services' },
    { name: 'Settings', href: '/profile?tab=settings', icon: Settings, description: 'App preferences' }
  ];

  // Quick actions for authenticated users
  const quickActions = [
    { name: 'Emergency Repair', href: '/book?emergency=true', icon: Zap, color: 'text-red-600' },
    { name: 'Find Mechanic', href: '/mechanics', icon: Search, color: 'text-blue-600' },
    { name: 'Support', href: '/support', icon: HelpCircle, color: 'text-green-600' }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      setShowMobileMenu(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu') && !target.closest('.services-menu')) {
        setShowUserMenu(false);
        setShowServicesMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg group-hover:shadow-lg transition-shadow">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  BikeRepair
                </span>
              </Link>
              
              {/* Desktop Navigation with Improved Structure */}
              <nav className="hidden lg:ml-12 lg:flex lg:space-x-1">
                {primaryNavigation.map((item) => {
                  const active = isActive(item.href);
                  
                  if (item.children) {
                    return (
                      <div key={item.name} className="relative services-menu">
                        <button
                          onClick={() => setShowServicesMenu(!showServicesMenu)}
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            active
                              ? 'text-primary-600 bg-primary-50 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.name}
                          {item.badge && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showServicesMenu ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Services Dropdown */}
                        {showServicesMenu && (
                          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                                onClick={() => setShowServicesMenu(false)}
                              >
                                <child.icon className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
                                <div>
                                  <div className="font-medium">{child.name}</div>
                                  <div className="text-xs text-gray-500 mt-1">{child.description}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'text-primary-600 bg-primary-50 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                      {item.badge && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {user && (
              <div className="flex items-center space-x-2">
                {/* Quick Actions - Desktop */}
                <div className="hidden md:flex items-center space-x-1 mr-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      to={action.href}
                      className={`p-2 rounded-lg transition-colors hover:bg-gray-100 ${action.color}`}
                      title={action.name}
                    >
                      <action.icon className="h-5 w-5" />
                    </Link>
                  ))}
                  
                  {/* Notifications */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                  </button>
                </div>

                {/* User Menu - Desktop */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="relative user-menu">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                        <p className="text-xs text-gray-500">{user.name}</p>
                      </div>
                      <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-semibold text-white">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* User Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              <p className="text-xs text-primary-600 font-medium">Premium Member</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          {userNavigation.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <item.icon className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        
                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleSignOut}
                            disabled={loading}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-5 w-5 mr-3" />
                            <div>
                              <div className="font-medium">Sign Out</div>
                              <div className="text-xs text-gray-500">End your session</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
                  >
                    {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Mobile Menu */}
          {showMobileMenu && user && (
            <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
              <div className="pt-4 pb-3 space-y-1">
                {/* User Info */}
                <div className="flex items-center px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 mx-4 rounded-lg border border-primary-200">
                  <div className="h-12 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <span className="text-white font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    <p className="text-xs text-primary-600 font-medium">Premium Member</p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors">
                      <Bell className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Actions</p>
                  <div className="grid grid-cols-3 gap-2">
                    {quickActions.map((action) => (
                      <Link
                        key={action.name}
                        to={action.href}
                        onClick={() => setShowMobileMenu(false)}
                        className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <action.icon className={`h-5 w-5 mb-1 ${action.color}`} />
                        <span className="text-xs font-medium text-gray-700">{action.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Primary Navigation */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Navigation</p>
                  <div className="space-y-1">
                    {primaryNavigation.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                            active
                              ? 'text-primary-600 bg-primary-50 border border-primary-200'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon className="h-5 w-5 mr-3" />
                          <div className="flex-1">
                            <div>{item.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                          </div>
                          {item.badge && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                
                {/* Account Section */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account</p>
                  <div className="space-y-1">
                    {userNavigation.slice(0, 4).map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <item.icon className="h-4 w-4 mr-3 text-gray-400" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Sign Out */}
                <div className="px-4 pt-2 border-t border-gray-200">
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="flex items-center w-full px-3 py-3 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Enhanced Bottom Navigation - Mobile */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden shadow-lg">
          <div className="grid grid-cols-4 py-1">
            {primaryNavigation.slice(0, 3).map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center py-2 px-1 text-xs transition-all duration-200 ${
                    active
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className={`relative p-1.5 rounded-lg ${active ? 'bg-primary-50' : ''}`}>
                    <item.icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`mt-1 font-medium ${active ? 'text-primary-600' : ''}`}>
                    {item.name === 'Dashboard' ? 'Home' : item.name}
                  </span>
                </Link>
              );
            })}
            
            {/* Profile Tab */}
            <Link
              to="/profile"
              className={`flex flex-col items-center py-2 px-1 text-xs transition-all duration-200 ${
                isActive('/profile')
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${isActive('/profile') ? 'bg-primary-50' : ''}`}>
                <User className={`h-5 w-5 ${isActive('/profile') ? 'text-primary-600' : 'text-gray-400'}`} />
              </div>
              <span className={`mt-1 font-medium ${isActive('/profile') ? 'text-primary-600' : ''}`}>
                Profile
              </span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}