export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  subscription_plan?: 'basic' | 'premium' | 'corporate';
  created_at: string;
}

export interface BikeIssue {
  id: string;
  type: 'flat_tire' | 'brake_issue' | 'chain_problem' | 'gear_issue' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  estimated_cost?: number;
  estimated_time?: number;
}

export interface ServiceRequest {
  id: string;
  user_id: string;
  mechanic_id?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  issues: BikeIssue[];
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_time?: string;
  estimated_arrival?: string;
  total_cost?: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface Mechanic {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  specialties: string[];
  current_location?: {
    latitude: number;
    longitude: number;
  };
  is_available: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  max_services: number;
}