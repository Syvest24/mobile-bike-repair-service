import { useEffect, useState } from 'react'
import { supabase, mockUser } from '../lib/supabase'

interface UserProfile {
id: string
email: string
name: string
phone: string
subscription\_plan: string
created\_at: string
}

export default function Profile() {
const \[profile, setProfile] = useState\<UserProfile | null>(null)

useEffect(() => {
async function loadProfile() {
try {
const { data, error } = await supabase.from('profiles').select('\*').single()
if (error) throw error
setProfile(data)
} catch {
setProfile(mockUser)
}
}

```
loadProfile()
```

}, \[])

return ( <div className="p-6"> <h1 className="text-2xl font-bold mb-4">Profile</h1>
{profile ? ( <div className="space-y-2"> <p><strong>Name:</strong> {profile.name}</p> <p><strong>Email:</strong> {profile.email}</p> <p><strong>Phone:</strong> {profile.phone}</p> <p><strong>Plan:</strong> {profile.subscription\_plan}</p> </div>
) : ( <p>Loading profile...</p>
)} </div>
)
}
