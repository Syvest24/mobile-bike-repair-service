import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Test Supabase connection
if (supabaseUrl && supabaseAnonKey) {
  console.log('✅ Supabase configured successfully');
  console.log('📡 URL:', supabaseUrl);
  console.log('🔑 Key configured:', supabaseAnonKey ? 'Yes' : 'No');
} else {
  console.warn('⚠️ Supabase environment variables not found');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Test connection function
export const testSupabaseConnection = async () => {
  if (!supabase) {
    console.error('❌ Supabase client not initialized');
    return false;
  }

  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};

// Mock data for demonstration
export const mockUser = {
  id: '1',
  email: 'cyclist@example.com',
  name: 'Alex Rider',
  phone: '+1 (555) 123-4567',
  subscription_plan: 'premium' as const,
  created_at: '2024-01-15T10:00:00Z'
};

export const mockServiceRequests = [
  {
    id: '1',
    user_id: '1',
    mechanic_id: 'mech-1',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Broadway, New York, NY 10001'
    },
    issues: [
      {
        id: 'issue-1',
        type: 'flat_tire' as const,
        description: 'Rear tire is completely flat',
        severity: 'high' as const,
        estimated_cost: 25,
        estimated_time: 15
      }
    ],
    status: 'in_progress' as const,
    scheduled_time: '2024-01-20T14:00:00Z',
    estimated_arrival: '2024-01-20T14:15:00Z',
    total_cost: 25,
    payment_status: 'paid' as const,
    created_at: '2024-01-20T13:30:00Z',
    updated_at: '2024-01-20T13:45:00Z'
  },
  {
    id: '2',
    user_id: '1',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '456 Park Ave, New York, NY 10016'
    },
    issues: [
      {
        id: 'issue-2',
        type: 'brake_issue' as const,
        description: 'Front brakes are squeaking loudly',
        severity: 'medium' as const,
        estimated_cost: 45,
        estimated_time: 30
      }
    ],
    status: 'pending' as const,
    scheduled_time: '2024-01-21T10:00:00Z',
    payment_status: 'pending' as const,
    created_at: '2024-01-20T16:00:00Z',
    updated_at: '2024-01-20T16:00:00Z'
  }
];

export const mockMechanics = [
  {
    id: 'mech-1',
    name: 'Mike Rodriguez',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.9,
    specialties: ['Road Bikes', 'Mountain Bikes', 'E-bikes'],
    current_location: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    is_available: true
  },
  {
    id: 'mech-2',
    name: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.8,
    specialties: ['Urban Bikes', 'Fixies', 'Vintage Bikes'],
    current_location: {
      latitude: 40.7589,
      longitude: -73.9851
    },
    is_available: true
  }
];