import React, { useEffect, useState } from 'react';
import {
  User, Mail, Phone, CreditCard, Settings, Star, Award,
  Edit3, Save, X, Camera, Shield, Bell, MapPin,
  Calendar, Clock, TrendingUp, Heart, Bike, Wrench,
  ChevronRight, Plus, Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, mockUser } from '../lib/supabase'; // Supabase client & mock

// Types
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
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch profile data from Supabase (or use mock)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser) return;

      if (!supabase) {
        setUser({
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone,
          subscription: { plan: mockUser.subscription_plan, nextRenewal: '2024-10-01' },
          bikes: [
            { id: '1', name: 'Roadster', type: 'Road', modelYear: 2022, color: 'Red', lastService: '2024-09-01', primary: true },
            { id: '2', name: 'Mountain X', type: 'Mountain', modelYear: 2021, color: 'Blue', lastService: '2024-08-15', primary: false }
          ],
          payments: [
            { id: '1', cardType: 'Visa', last4: '1234', expiry: '12/25', default: true },
            { id: '2', cardType: 'Mastercard', last4: '5678', expiry: '09/24', default: false }
          ]
        });
        setEditedUser({
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone || ''
        });
        setLoading(false);
        return;
      }

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
          phone: data.phone || ''
        });
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [authUser]);

  if (loading || !user) return <div className="p-8 text-center">Loading...</div>;

  // Stats for Overview
  const stats = [
    { label: 'Total Services', value: user.bikes?.length || 0, icon: Wrench, color: 'bg-blue-50 text-blue-600' },
    { label: 'This Month', value: '3', icon: Calendar, color: 'bg-green-50 text-green-600' },
    { label: 'Avg Response', value: '15min', icon: Clock, color: 'bg-purple-50 text-purple-600' },
    { label: 'Saved Money', value: '$240', icon: TrendingUp, color: 'bg-orange-50 text-orange-600' }
  ];

  const subscriptionPlans = [
    { id: 'basic', name: 'Basic', price: 29, interval: 'monthly', features: ['2 services per month','Standard response time','Basic support'], current: user.subscription?.plan==='basic' },
    { id: 'premium', name: 'Premium', price: 49, interval: 'monthly', features: ['5 services per month','Priority response','24/7 support','Free diagnostics'], current: user.subscription?.plan==='premium' },
    { id: 'corporate', name: 'Corporate', price: 199, interval: 'monthly', features: ['Unlimited services','Dedicated mechanic','On-site visits','Fleet management'], current: user.subscription?.plan==='corporate' }
  ];

  const handleSave = async () => {
    if (!supabase) {
      setUser({...user, ...editedUser});
      setIsEditing(false);
      return;
    }
    const { error } = await supabase.from('users').update({
      name: editedUser.name,
      email: editedUser.email,
      phone: editedUser.phone
    }).eq('id', user.id);

    if (error) console.error(error);
    else {
      setUser({...user, ...editedUser});
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      name: user.name,
      email: user.email,
      phone: user.phone || ''
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
                <span className="text-2xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color}`}><stat.icon className="h-4 w-4" /></div>
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
            { id:'overview', label:'Overview', icon:TrendingUp },
            { id:'profile', label:'Personal Info', icon:User },
            { id:'bikes', label:'My Bikes', icon:Bike },
            { id:'subscription', label:'Subscription', icon:Award },
            { id:'payment', label:'Payment', icon:CreditCard },
            { id:'settings', label:'Settings', icon:Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={()=>setActiveTab(tab.id as ProfileTab)}
              className={`flex items-center px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab===tab.id?'border-primary-500 text-primary-600 bg-primary-50':'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tabs Content */}
      <div className="space-y-6">
        {/* Overview */}
        {activeTab==='overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Subscription</h3>
              <p>Plan: {user.subscription?.plan}</p>
              <p>Next Renewal: {user.subscription?.nextRenewal}</p>
            </div>
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Bikes</h3>
              {user.bikes?.map(b => <p key={b.id}>{b.name} ({b.type})</p>)}
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab==='profile' && (
          <div className="p-6 bg-white rounded-xl border shadow-sm">
            {isEditing ? (
              <div className="space-y-4">
                <input className="input-field" value={editedUser.name} onChange={e=>setEditedUser({...editedUser,name:e.target.value})} placeholder="Name"/>
                <input className="input-field" type="email" value={editedUser.email} onChange={e=>setEditedUser({...editedUser,email:e.target.value})} placeholder="Email"/>
                <input className="input-field" value={editedUser.phone} onChange={e=>setEditedUser({...editedUser,phone:e.target.value})} placeholder="Phone"/>
                <div className="flex gap-4 mt-2">
                  <button onClick={handleSave} className="btn-primary">Save</button>
                  <button onClick={handleCancel} className="btn-secondary">Cancel</button>
                </div>
              </div>
            ):(
              <div className="space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                <button onClick={()=>setIsEditing(true)} className="btn-primary mt-2">Edit</button>
              </div>
            )}
          </div>
        )}

        {/* Bikes */}
        {activeTab==='bikes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.bikes?.map(bike=>(
              <div key={bike.id} className={`p-4 rounded-xl border ${bike.primary?'border-primary-500':'border-gray-200'}`}>
                <h4 className="font-semibold text-lg">{bike.name}</h4>
                <p>{bike.type} • {bike.modelYear} • {bike.color}</p>
                <p className="text-sm text-gray-500">Last Service: {bike.lastService}</p>
              </div>
            ))}
          </div>
        )}

        {/* Subscription */}
        {activeTab==='subscription' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map(plan=>(
              <div key={plan.id} className={`p-6 rounded-xl border shadow-sm ${plan.current?'border-primary-500 bg-primary-50':'border-gray-200'}`}>
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-sm text-gray-600">${plan.price}/{plan.interval}</p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  {plan.features.map((f,i)=><li key={i}>• {f}</li>)}
                </ul>
                {plan.current && <span className="mt-2 inline-block text-sm font-medium text-primary-600">Current Plan</span>}
              </div>
            ))}
          </div>
        )}

        {/* Payment */}
        {activeTab==='payment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.payments?.map(card=>(
              <div key={card.id} className={`p-4 rounded-xl border ${card.default?'border-primary-500':'border-gray-200'}`}>
                <p className="font-medium">{card.cardType.toUpperCase()} ****{card.last4}</p>
                <p className="text-sm text-gray-500">Expires: {card.expiry}</p>
              </div>
            ))}
          </div>
        )}

        {/* Settings */}
        {activeTab==='settings' && (
          <div className="p-6 bg-white rounded-xl border shadow-sm">
            <p>Settings content placeholder</p>
          </div>
        )}
      </div>
    </div>
  );
}
