import { useEffect, useState } from 'react'
import { supabase, mockServiceRequests, mockMechanics } from '../lib/supabase'

interface ServiceRequest {
id: string
user\_id: string
mechanic\_id?: string
location: {
latitude: number
longitude: number
address: string
}
issues: {
id: string
type: string
description: string
severity: string
estimated\_cost: number
estimated\_time: number
}\[]
status: string
scheduled\_time: string
estimated\_arrival?: string
total\_cost?: number
payment\_status: string
created\_at: string
updated\_at: string
}

interface Mechanic {
id: string
name: string
avatar: string
rating: number
specialties: string\[]
current\_location: {
latitude: number
longitude: number
}
is\_available: boolean
}

export default function Home() {
const \[requests, setRequests] = useState\<ServiceRequest\[]>(\[])
const \[mechanics, setMechanics] = useState\<Mechanic\[]>(\[])
const \[selectedRequest, setSelectedRequest] = useState\<ServiceRequest | null>(null)

useEffect(() => {
// fallback to mock data if Supabase is not available
async function loadData() {
try {
const { data: serviceRequests } = await supabase.from('service\_requests').select('*')
const { data: mechanicsData } = await supabase.from('mechanics').select('*')

```
    setRequests(serviceRequests ?? mockServiceRequests)
    setMechanics(mechanicsData ?? mockMechanics)
  } catch {
    setRequests(mockServiceRequests)
    setMechanics(mockMechanics)
  }
}

loadData()
```

}, \[])

return ( <div className="p-6"> <h1 className="text-2xl font-bold mb-4">Your Bike Service Requests</h1>
{requests.map((req) => (
\<div
key={req.id}
className="border rounded-lg p-4 mb-2 cursor-pointer hover\:bg-gray-50"
onClick={() => setSelectedRequest(req)}
\> <p><strong>Issue:</strong> {req.issues\[0].description}</p> <p><strong>Status:</strong> {req.status}</p> </div>
))}

```
  {selectedRequest && (
    <div className="mt-4 p-4 border rounded-lg bg-gray-100">
      <h2 className="font-semibold">Request Details</h2>
      <p>Location: {selectedRequest.location.address}</p>
      <p>Scheduled: {new Date(selectedRequest.scheduled_time).toLocaleString()}</p>
    </div>
  )}
</div>
```

)
}
