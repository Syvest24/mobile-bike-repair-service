import React, { useState } from 'react';
import { User, Mail, Phone, CreditCard, Settings, Star, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'payment'>('profile');

  if (!user) return null;

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <button
          onClick={signOut}
          className="btn-secondary"
        >
          Sign Out
        </button>
      </div>

      {/* Profile Header */}
      <div className="card mb-8">
        <div className="flex items-center">
          <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">Premium Member</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'subscription', label: 'Subscription', icon: Award },
            { id: 'payment', label: 'Payment', icon: CreditCard }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue={user.phone || ''}
                  placeholder="+1 (555) 123-4567"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 987-6543"
                  className="input"
                />
              </div>
            </div>
            <div className="mt-6">
              <button className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bike Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Trek FX 3 Disc</h4>
                  <p className="text-sm text-gray-600">Hybrid • 2023 • Primary bike</p>
                </div>
                <button className="btn-secondary">
                  Edit
                </button>
              </div>
              <button className="btn-secondary w-full">
                Add Another Bike
              </button>
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

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <span className="text-xs font-bold text-gray-600">VISA</span>
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
              <button className="btn-secondary w-full">
                Add Payment Method
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
            <div className="space-y-3">
              {[
                { date: 'Jan 1, 2024', amount: '$49.00', status: 'Paid' },
                { date: 'Dec 1, 2023', amount: '$49.00', status: 'Paid' },
                { date: 'Nov 1, 2023', amount: '$49.00', status: 'Paid' }
              ].map((invoice, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
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