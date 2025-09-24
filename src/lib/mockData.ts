export interface ServiceIssue {
  description: string;
  severity: 'low' | 'medium' | 'high';
  estimated_cost?: number;
}

export interface ServiceRequest {
  id: number;
  created_at: string;
  mechanic_id: number;
  location: { address: string };
  scheduled_time?: string;
  total_cost?: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  issues: ServiceIssue[];
}

export interface Mechanic {
  id: number;
  name: string;
  avatar: string;
  rating: number;
}

export const mockMechanics: Mechanic[] = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/100?img=1',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/100?img=2',
    rating: 4.6,
  },
];

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: 101,
    created_at: new Date().toISOString(),
    mechanic_id: 1,
    location: { address: '123 Main St, Springfield' },
    scheduled_time: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
    total_cost: 50,
    status: 'in_progress',
    issues: [
      { description: 'Flat tire', severity: 'medium', estimated_cost: 20 },
      { description: 'Brake adjustment', severity: 'low', estimated_cost: 15 },
    ],
  },
  {
    id: 102,
    created_at: new Date().toISOString(),
    mechanic_id: 2,
    location: { address: '456 Elm St, Shelbyville' },
    status: 'pending',
    issues: [{ description: 'Chain replacement', severity: 'high' }],
  },
];
