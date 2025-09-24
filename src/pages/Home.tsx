import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, MapPin, Clock, Star, Zap,
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
        // Most recent service request
        const { data: serviceData } = await supabase
          .from<ServiceRequest, ServiceRequest>('service_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setRecentService(serviceData || null);

        // Available mechanics
        const { data: mechanicsData } = await supabase
          .from<Mechanic, Mechanic>('mechanics')
          .select('*')
          .eq('is_available', true);

        setAvailableMechanics(mechanicsData || []);
      } catch (err) {
        console.error(err);
        // Fallback to mock data
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

      {/* Current Service Request */}
      {user && recentService && recentService.status !== 'completed' && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 mb-8 border border-primary-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-primary-600" />
                Current Service Request
              </h3>
              <div className="flex items-center text-sm text-primary-700 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {recentService.location.address}
              </div>
              <div className="flex items-center text-sm text-primary-700">
                <Clock className="h-4 w-4 mr-1" />
                Estimated arrival: {new Date(recentService.estimated_arrival).toLocaleTimeString()}
              </div>
            </div>
            <span className="badge bg-primary-100 text-primary-700 border border-primary-200">
              {recentService.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-primary-900">
                  {recentService.issues[0].description}
                </div>
                <div className="text-sm text-primary-700">
                  Est. ${recentService.issues[0].estimated_cost} • {recentService.issues[0].estimated_time} min
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Phone className="h-4 w-4" />
                </button>
                <Link to="/bookings" className="btn-primary flex items-center justify-center px-4 py-2 rounded">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link to="/book" className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all duration-200 flex items-center">
          <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg mr-4">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">Emergency Repair</h3>
            <p className="text-sm text-gray-600">Get help now</p>
          </div>
        </Link>
        <Link to="/bookings" className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all duration-200 flex items-center">
          <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg mr-4">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">Schedule Service</h3>
            <p className="text-sm text-gray-600">Plan ahead</p>
          </div>
        </Link>
        <Link to="/profile" className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all duration-200 flex items-center">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg mr-4">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">Upgrade Plan</h3>
            <p className="text-sm text-gray-600">Save more</p>
          </div>
        </Link>
      </div>

      {/* Available Mechanics */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">Available Mechanics</h3>
          <div className="flex items-center">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">{availableCount} online now</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableMechanics.slice(0, 2).map((mechanic) => (
            <div key={mechanic.id} className="flex items-center p-6 border border-gray-200 rounded-xl hover:shadow-md hover:border-primary-200 transition-all duration-200">
              <img src={mechanic.avatar} alt={mechanic.name} className="h-16 w-16 rounded-full object-cover shadow-lg" />
              <div className="ml-6 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 text-lg">{mechanic.name}</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-600 ml-1">{mechanic.rating}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">{mechanic.specialties.join(', ')}</div>
                <div className="flex items-center mt-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs font-medium text-green-600">Available now</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
