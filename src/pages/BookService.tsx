import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, User } from 'lucide-react';
import DiagnosticTool from '../components/DiagnosticTool';
import { BikeIssue } from '../types';
import { mockMechanics } from '../lib/supabase';

export default function BookService() {
  const [step, setStep] = useState<'location' | 'diagnostic' | 'schedule' | 'mechanic' | 'confirm'>('location');
  const [location, setLocation] = useState('');
  const [detectedIssues, setDetectedIssues] = useState<BikeIssue[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);

  const totalCost = detectedIssues.reduce((sum, issue) => sum + (issue.estimated_cost || 0), 0);
  const totalTime = detectedIssues.reduce((sum, issue) => sum + (issue.estimated_time || 0), 0);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      setStep('diagnostic');
    }
  };

  const handleIssuesDetected = (issues: BikeIssue[]) => {
    setDetectedIssues(issues);
    setStep('schedule');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTime || isEmergency) {
      setStep('mechanic');
    }
  };

  const handleMechanicSelect = (mechanicId: string) => {
    setSelectedMechanic(mechanicId);
    setStep('confirm');
  };

  const handleBookingConfirm = () => {
    // Here you would typically make an API call to create the booking
    alert('Booking confirmed! You will receive a confirmation email shortly.');
  };

  if (step === 'location') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex items-center mb-6">
            <MapPin className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Where do you need service?</h2>
          </div>

          <form onSubmit={handleLocationSubmit}>
            <div className="mb-6">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Service Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your address or location"
                className="input"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                We'll send a mechanic to this location
              </p>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  This is an emergency (additional $20 fee)
                </span>
              </label>
            </div>

            <button type="submit" className="btn-primary w-full">
              Continue to Diagnosis
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'diagnostic') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DiagnosticTool onIssuesDetected={handleIssuesDetected} />
      </div>
    );
  }

  if (step === 'schedule') {
    const timeSlots = [
      'ASAP (within 30 min)',
      'Within 1 hour',
      'Within 2 hours',
      'Tomorrow morning',
      'Tomorrow afternoon',
      'This weekend'
    ];

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex items-center mb-6">
            <Clock className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">When do you need service?</h2>
          </div>

          <form onSubmit={handleScheduleSubmit}>
            <div className="space-y-3 mb-6">
              {timeSlots.map((slot) => (
                <label
                  key={slot}
                  className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot}
                    checked={selectedTime === slot}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">{slot}</span>
                </label>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Service Summary</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {detectedIssues.map((issue, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{issue.description}</span>
                    <span>${issue.estimated_cost}</span>
                  </div>
                ))}
                {isEmergency && (
                  <div className="flex justify-between text-warning-600">
                    <span>Emergency fee</span>
                    <span>$20</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-1 mt-2 flex justify-between font-medium text-gray-900">
                  <span>Total</span>
                  <span>${totalCost + (isEmergency ? 20 : 0)}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep('diagnostic')}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button type="submit" className="btn-primary flex-1">
                Select Mechanic
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'mechanic') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Mechanic</h2>
          </div>

          <div className="space-y-4 mb-6">
            {mockMechanics.map((mechanic) => (
              <div
                key={mechanic.id}
                onClick={() => handleMechanicSelect(mechanic.id)}
                className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <img
                  src={mechanic.avatar}
                  alt={mechanic.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{mechanic.name}</h3>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">{mechanic.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Specializes in: {mechanic.specialties.join(', ')}
                  </p>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-success-500 rounded-full mr-2"></div>
                    <span className="text-xs text-success-600">Available now</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('schedule')}
            className="btn-secondary w-full"
          >
            Back to Schedule
          </button>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    const selectedMechanicData = mockMechanics.find(m => m.id === selectedMechanic);

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Your Booking</h2>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Service Location</h3>
              <p className="text-gray-600">{location}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Scheduled Time</h3>
              <p className="text-gray-600">{selectedTime}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Your Mechanic</h3>
              <div className="flex items-center">
                <img
                  src={selectedMechanicData?.avatar}
                  alt={selectedMechanicData?.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{selectedMechanicData?.name}</p>
                  <p className="text-sm text-gray-600">★ {selectedMechanicData?.rating}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Services</h3>
              <div className="space-y-2">
                {detectedIssues.map((issue, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{issue.description}</span>
                    <span className="text-gray-900">${issue.estimated_cost}</span>
                  </div>
                ))}
                {isEmergency && (
                  <div className="flex justify-between text-sm">
                    <span className="text-warning-600">Emergency fee</span>
                    <span className="text-warning-600">$20</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Cost</span>
              <span className="text-2xl font-bold text-gray-900">
                ${totalCost + (isEmergency ? 20 : 0)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Estimated service time: {totalTime} minutes
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setStep('mechanic')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleBookingConfirm}
              className="btn-primary flex-1"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}