import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  User, CreditCard, Settings, Star, Award, 
  Edit3, Save, X, Camera, Shield, MapPin, 
  Calendar, Clock, TrendingUp, Heart, Bike, Wrench,
  ChevronRight, Plus, Trash2
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    emergencyContact: ''
  });

  if (!user) return null;

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const breadcrumbItems = [
    { label: 'Profile', href: '/profile' },
    ...(activeTab !== 'overview' ? [{ label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }] : [])
  ];

  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      interval: 'monthly',
      features: ['2 services per month', 'Standard response time', 'Basic support'],
      current: user.subscription_plan === 'basic'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 49,
      interval: 'monthly',
      features: ['5 services per month', 'Priority response', '24/7 support', 'Free diagnostics'],
      current: user.subscription_plan === 'premium'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      price: 199,
      interval: 'monthly',
      features: ['Unlimited services', 'Dedicated mechanic', 'On-site visits', 'Fleet management'],
      current: user.subscription_plan === 'corporate'
    }
  ];

  const stats = [
    { label: 'Total Services', value: '12', icon: Wrench, color: 'text-blue-600 bg-blue-50' },
    { label: 'This Month', value: '3', icon: Calendar, color: 'text-green-600 bg-green-50' },
    { label: 'Avg Response', value: '15min', icon: Clock, color: 'text-purple-600 bg-purple-50' },
    { label: 'Saved Money', value: '$240', icon: TrendingUp, color: 'text-orange-600 bg-orange-50' }
  ];

  const handleSave = () => {
    // Here you would typically make an API call to update the user
    console.log('Saving user data:', editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      emergencyContact: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="relative">
              <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <span className="text-2xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 p-2 bg-white text-primary-600 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-primary-100 text-lg">{user.email}</p>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 text-yellow-300 fill-current" />
                <span className="ml-2 text-primary-100">Premium Member since 2024</span>
              </div>
            </div>
          </div>
          <button
            onClick={signOut}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color.replace('text-', 'bg-').replace('bg-', 'bg-white/20 text-white')}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-primary-100 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <nav className="flex overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'profile', label: 'Personal Info', icon: User },
            { id: 'bikes', label: 'My Bikes', icon: Bike },
            { id: 'subscription', label: 'Subscription', icon: Award },
            { id: 'payment', label: 'Payment', icon: CreditCard },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 bg-primary-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { type: 'service', title: 'Brake adjustment completed', time: '2 hours ago', status: 'completed' },
                  { type: 'booking', title: 'New service booked for tomorrow', time: '1 day ago', status: 'pending' },
                  { type: 'payment', title: 'Monthly subscription renewed', time: '3 days ago', status: 'paid' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full mr-4 ${
                      activity.type === 'service' ? 'bg-green-100 text-green-600' :
                      activity.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'service' ? <Wrench className="h-4 w-4" /> :
                       activity.type === 'booking' ? <Calendar className="h-4 w-4" /> :
                       <CreditCard className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <span className={`badge ${
                      activity.status === 'completed' ? 'badge-success' :
                      activity.status === 'pending' ? 'badge-warning' :
                      'badge bg-purple-50 text-purple-600'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Wrench className="h-5 w-5 text-primary-600 mr-3" />
                    <span className="font-medium text-primary-900">Book Emergency Service</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">Schedule Maintenance</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">Upgrade Plan</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Mechanics</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <img
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop"
                    alt="Mike Rodriguez"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900">Mike Rodriguez</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500 ml-1">4.9</span>
                    </div>
                  </div>
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                  disabled={!isEditing}
                  className={`input ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  disabled={!isEditing}
                  className={`input ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                  disabled={!isEditing}
                  placeholder="+1 (555) 123-4567"
                  className={`input ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  value={editedUser.emergencyContact}
                  onChange={(e) => setEditedUser({...editedUser, emergencyContact: e.target.value})}
                  disabled={!isEditing}
                  placeholder="+1 (555) 987-6543"
                  className={`input ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bikes Tab */}
      {activeTab === 'bikes' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Bikes</h3>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Add Bike
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center mb-2">
                    <Bike className="h-5 w-5 text-primary-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Trek FX 3 Disc</h4>
                    <span className="ml-2 badge-success">Primary</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Hybrid • 2023 Model • Blue</p>
                  <p className="text-xs text-gray-500">Last service: 2 weeks ago</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center mb-2">
                    <Bike className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="font-semibold text-gray-900">Specialized Sirrus X</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Road • 2022 Model • Red</p>
                  <p className="text-xs text-gray-500">Last service: 1 month ago</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-primary-900">Premium Plan</h4>
                  <p className="text-primary-700">$49/month • Renews on Jan 25, 2024</p>
                </div>
                <span className="badge bg-primary-100 text-primary-700">Active</span>
              </div>
            </div>

            <h4 className="font-medium text-gray-900 mb-4">Available Plans</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-6 ${
                    plan.current
                      ? 'border-primary-200 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/{plan.interval}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="h-1.5 w-1.5 bg-primary-600 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full ${
                      plan.current
                        ? 'btn-secondary cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Notifications</h3>
            <div className="space-y-4">
              {[
                { label: 'Service reminders', description: 'Get notified about upcoming maintenance' },
                { label: 'Booking confirmations', description: 'Receive confirmation for new bookings' },
                { label: 'Mechanic updates', description: 'Updates from your assigned mechanic' },
                { label: 'Promotional offers', description: 'Special deals and discounts' }
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">{setting.label}</p>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={index < 3} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy & Security</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Location Preferences</p>
                    <p className="text-sm text-gray-500">Manage saved locations</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="card border-red-200">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center p-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="h-10 w-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-4 shadow-sm">
                    <span className="text-xs font-bold text-white">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-600">Expires 12/25</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="badge-success">Default</span>
                  <button className="btn-secondary">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h3>
            <div className="space-y-3">
              {[
                { date: 'Jan 1, 2024', amount: '$49.00', status: 'Paid' },
                { date: 'Dec 1, 2023', amount: '$49.00', status: 'Paid' },
                { date: 'Nov 1, 2023', amount: '$49.00', status: 'Paid' }
              ].map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.date}</p>
                    <p className="text-sm text-gray-600">Premium Plan</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{invoice.amount}</p>
                    <span className="badge-success">{invoice.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}