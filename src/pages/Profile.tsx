import React, { useEffect, useState } from 'react';
import {
  User, Mail, Phone, CreditCard, Settings, Star, Award,
  Edit3, Save, X, Camera, Shield, Bell, MapPin,
  Calendar, Clock, TrendingUp, Heart, Bike, Wrench,
  ChevronRight, Plus, Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase'; // Your Supabase client

interface Bike {
  id: string;
  name: string;
  type: string;
  modelYear: number;
  color: string;
  lastService: string;
  primary: boolean;
}

interface Subscription {
  plan: 'basic' | 'premium' | 'corporate';
  nextRenewal: string;
}

interface Payment {
  id: string;
  cardType: string;
  last4: string;
  expiry: string;
  default: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subscription?: Subscription;
  bikes?: Bike[];
  payments?: Payment[];
}

type ProfileTab = 'overview' | 'profile' | 'bikes' | 'subscription' | 'payment' | 'settings';

export default function Profile() {
  const { user: authUser, signOut } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: ''
  });

  // Fetch profile data from Supabase
  useEffect(() => {
    if (!authUser) return;

    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from<UserProfile>('users')
        .select(`*, bikes(*), payments(*)`)
        .eq('id', authUser.id)
        .single();

      if (error) console.error(error);
      else {
        setUser(data);
        setEditedUser({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          emergencyContact: ''
        });
      }
    };

    fetchUserProfile();
  }, [authUser]);

  if (!user) return <div>Loading...</div>;

  // Stats
  const stats = [
    { label: 'Total Services', value: user.bikes?.length || 0, icon: Wrench, color: 'text-blue-600 bg-blue-50' },
    { label: 'This Month', value: '3', icon: Calendar, color: 'text-green-600 bg-green-50' },
    { label: 'Avg Response', value: '15min', icon: Clock, color: 'text-purple-600 bg-purple-50' },
    { label: 'Saved Money', value: '$240', icon: TrendingUp, color: 'text-orange-600 bg-orange-50' }
  ];

  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      interval: 'monthly',
      features: ['2 services per month', 'Standard response time', 'Basic support'],
      current: user.subscription?.plan === 'basic'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 49,
      interval: 'monthly',
      features: ['5 services per month', 'Priority response', '24/7 support', 'Free diagnostics'],
      current: user.subscription?.plan === 'premium'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      price: 199,
      interval: 'monthly',
      features: ['Unlimited services', 'Dedicated mechanic', 'On-site visits', 'Fleet management'],
      current: user.subscription?.plan === 'corporate'
    }
  ];

  const handleSave = async () => {
    const { error } = await supabase
      .from('users')
      .update({ name: editedUser.name, email: editedUser.email, phone: editedUser.phone })
      .eq('id', user.id);

    if (error) console.error(error);
    else {
      setUser({ ...user, name: editedUser.name, email: editedUser.email, phone: editedUser.phone });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      emergencyContact: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
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
              onClick={() => setActiveTab(tab.id as ProfileTab)}
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

      {/* The rest of the tabs (overview, profile, bikes, subscription, payment, settings) */}
      {/* Reuse your previous JSX here, but use `user.bikes`, `user.payments`, and `user.subscription` for live data */}
    </div>
  );
}
