import { Calendar, MapPin, Clock, DollarSign, User, Phone } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { mockServiceRequests, mockMechanics } from '../lib/supabase';

export default function Bookings() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'accepted':
      case 'in_progress':
        return 'badge bg-blue-50 text-blue-600';
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <Breadcrumb items={[{ label: 'My Bookings' }]} className="mb-6" />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <div className="text-sm text-gray-600">
          {mockServiceRequests.length} total bookings
        </div>
      </div>

      <div className="space-y-6">
        {mockServiceRequests.map((request) => {
          const mechanic = mockMechanics.find(m => m.id === request.mechanic_id);
          
          return (
            <div key={request.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Service Request #{request.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Created {formatDate(request.created_at)}
                    </p>
                  </div>
                </div>
                <span className={getStatusColor(request.status)}>
                  {request.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-start mb-3">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{request.location.address}</p>
                    </div>
                  </div>

                  {request.scheduled_time && (
                    <div className="flex items-start mb-3">
                      <Clock className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Scheduled</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(request.scheduled_time)}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.total_cost && (
                    <div className="flex items-start">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total Cost</p>
                        <p className="text-sm text-gray-600">${request.total_cost}</p>
                      </div>
                    </div>
                  )}
                </div>

                {mechanic && (
                  <div>
                    <div className="flex items-start mb-3">
                      <User className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mechanic</p>
                        <div className="flex items-center mt-1">
                          <img
                            src={mechanic.avatar}
                            alt={mechanic.name}
                            className="h-6 w-6 rounded-full object-cover mr-2"
                          />
                          <span className="text-sm text-gray-600">{mechanic.name}</span>
                          <span className="text-xs text-yellow-500 ml-2">★ {mechanic.rating}</span>
                        </div>
                      </div>
                    </div>

                    {request.status === 'in_progress' && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-primary-600 mr-2" />
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                          Call Mechanic
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Issues</h4>
                <div className="space-y-2">
                  {request.issues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{issue.description}</span>
                      <div className="flex items-center space-x-4">
                        <span className={`badge ${
                          issue.severity === 'high' ? 'badge-error' :
                          issue.severity === 'medium' ? 'badge-warning' :
                          'badge-success'
                        }`}>
                          {issue.severity}
                        </span>
                        {issue.estimated_cost && (
                          <span className="text-gray-900 font-medium">
                            ${issue.estimated_cost}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {( ['pending', 'accepted', 'in_progress'] as const ).includes(request.status as any) && (
                <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button className="btn-secondary flex-1">
                    Modify Booking
                  </button>
                  <button className="btn text-error-600 hover:bg-error-50 flex-1">
                    Cancel
                  </button>
                </div>
              )}

              {( ['completed'] as const ).includes(request.status as any) && (
                <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button className="btn-secondary flex-1">
                    Download Receipt
                  </button>
                  <button className="btn-primary flex-1">
                    Rate Service
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {mockServiceRequests.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">
            Book your first bike repair service to get started.
          </p>
          <button className="btn-primary">
            Book Service Now
          </button>
        </div>
      )}
    </div>
  );
}