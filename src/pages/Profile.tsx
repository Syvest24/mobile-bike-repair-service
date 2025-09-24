import { useEffect, useState } from 'react';
import { User, CreditCard, Settings, Award, Calendar, Clock, TrendingUp, Bike, Wrench } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    if (!authUser) return;

    const fetchUserProfile = async () => {
      const { data } = await supabase
        .from<UserProfile, UserProfile>('users')
        .select(`*, bikes(*), payments(*)`)
        .eq('id', authUser.id)
        .single();

      if (data) setUser(data);
    };

    fetchUserProfile();
  }, [authUser]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="relative">
              <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <span className="text-2xl font-bold text-white">{user.name.charAt(0)}</span>
              </div>
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
      </div>
    </div>
  );
}
