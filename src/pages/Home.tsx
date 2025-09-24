import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, MapPin, Clock, Star, Shield, Zap,
  Calendar, TrendingUp, ArrowRight, CheckCircle, Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, mockServiceRequests, mockMechanics } from '../lib/supabase';

interface ServiceRequest {
  id: string;
  user_id: string;
  issues: { description: string; estimated_cost: number; estimated_time: number }[];
  location: { address: string };
  status: string;
  estimated_arrival: string;
}

interface Mechanic {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  specialties: string[];
  is_available: boolean;
}

export default function Home() {
  const { user } = useAuth();
  const [recentService, setRecentService] = useState<ServiceRequest | null>(null);
  const [availableMechanics, setAvailableMechanics] = useState<Mechanic[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch user's most recent service request
        const { data: serviceData } = await supabase
          .from<ServiceRequest, ServiceRequest>('service_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setRecentService(serviceData || null);

        // Fetch available mechanics
        const { data: mechanicsData } = await supabase
          .from<Mechanic, Mechanic>('mechanics')
          .select('*')
          .eq('is_available', true);

        setAvailableMechanics(mechanicsData || []);
      } catch (err) {
        console.error(err);
        // fallback to mock data
        setRecentService(mockServiceRequests[0]);
        setAvailableMechanics(mockMechanics.filter(m => m.is_available));
      }
    };

    fetchData();
  }, [user]);

  const availableCount = availableMechanics.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          On-Demand Bike Repair
          <span className="block bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Where You Need It
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Professional bike mechanics come to you. Fast, reliable, and convenient service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/book" className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
            <Wrench className="h-5 w-5 mr-2" />
            Book Repair Now
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
          <Link to="/book" className="btn-secondary text-lg px-8 py-4 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
            <Zap className="h-5 w-5 mr-2" />
            Quick Diagnosis
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-primary-600 mb-2">{availableCount}</div>
          <div className="text-sm font-medium text-gray-600">Mechanics Available</div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-primary-600 mb-2">15</div>
          <div className="text-sm font-medium text-gray-600">Min Avg Response</div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-primary-600 mb-2">4.9</div>
          <div className="text-sm font-medium text-gray-600">Customer Rating</div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
          <div className="text-sm font-medium text-gray-600">Service Available</div>
        </div>
      </div>
    </div>
  );
}
