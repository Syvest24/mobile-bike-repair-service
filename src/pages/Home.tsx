import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  Star, 
  Shield, 
  Zap,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockServiceRequests, mockMechanics } from '../lib/supabase';

export default function Home() {
  const { user } = useAuth();
  
  const recentService = mockServiceRequests[0];
  const availableMechanics = mockMechanics.filter(m => m.is_available).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          On-Demand Bike Repair
          <span className="block text-primary-600">Where You Need It</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Professional bike mechanics come to you. Fast, reliable, and convenient service 
          for urban cyclists and cycling enthusiasts.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/book" className="btn-primary text-lg px-8 py-3">
            <Wrench className="h-5 w-5 mr-2" />
            Book Repair Now
          </Link>
          <Link to="/diagnostic" className="btn-secondary text-lg px-8 py-3">
            <Zap className="h-5 w-5 mr-2" />
            Quick Diagnosis
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{availableMechanics}</div>
          <div className="text-sm text-gray-600">Mechanics Available</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">15</div>
          <div className="text-sm text-gray-600">Min Avg Response</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">4.9</div>
          <div className="text-sm text-gray-600">Customer Rating</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
          <div className="text-sm text-gray-600">Service Available</div>
        </div>
      </div>

      {user && (
        <>
          {/* Current Service Status */}
          {recentService && recentService.status !== 'completed' && (
            <div className="card mb-8 border-l-4 border-l-primary-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Current Service Request
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {recentService.location.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Estimated arrival: {new Date(recentService.estimated_arrival!).toLocaleTimeString()}
                  </div>
                </div>
                <span className="badge-warning">
                  {recentService.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {recentService.issues[0].description}
                    </div>
                    <div className="text-sm text-gray-600">
                      Est. ${recentService.issues[0].estimated_cost} • {recentService.issues[0].estimated_time} min
                    </div>
                  </div>
                  <Link to="/bookings" className="btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link to="/book" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Wrench className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Emergency Repair</h3>
                  <p className="text-sm text-gray-600">Get help now</p>
                </div>
              </div>
            </Link>

            <Link to="/bookings" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-success-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Schedule Service</h3>
                  <p className="text-sm text-gray-600">Plan ahead</p>
                </div>
              </div>
            </Link>

            <Link to="/subscription" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-warning-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Upgrade Plan</h3>
                  <p className="text-sm text-gray-600">Save more</p>
                </div>
              </div>
            </Link>
          </div>
        </>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="p-4 bg-primary-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">We Come to You</h3>
          <p className="text-gray-600">
            Our mechanics travel to your location - office, home, or anywhere you need service.
          </p>
        </div>

        <div className="text-center">
          <div className="p-4 bg-success-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Clock className="h-8 w-8 text-success-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Response</h3>
          <p className="text-gray-600">
            Average 15-minute response time with real-time tracking of your mechanic.
          </p>
        </div>

        <div className="text-center">
          <div className="p-4 bg-warning-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-8 w-8 text-warning-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
          <p className="text-gray-600">
            All repairs backed by our satisfaction guarantee and professional mechanics.
          </p>
        </div>
      </div>

      {/* Available Mechanics */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Available Mechanics</h3>
          <span className="text-sm text-gray-600">{availableMechanics} online now</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockMechanics.slice(0, 2).map((mechanic) => (
            <div key={mechanic.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
              <img
                src={mechanic.avatar}
                alt={mechanic.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{mechanic.name}</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{mechanic.rating}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {mechanic.specialties.join(', ')}
                </div>
                <div className="flex items-center mt-1">
                  <div className="h-2 w-2 bg-success-500 rounded-full mr-2"></div>
                  <span className="text-xs text-success-600">Available now</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}