import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

interface AuthContextType {
user: any
loading: boolean
signOut: () => Promise<void>
}

const AuthContext = createContext\<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
const \[user, setUser] = useState<any>(null)
const \[loading, setLoading] = useState(true)

useEffect(() => {
const { data: subscription } = supabase.auth.onAuthStateChange((\_event, session) => {
setUser(session?.user ?? null)
setLoading(false)
})

```
return () => {
  subscription.subscription.unsubscribe()
}
```

}, \[])

const signOut = async () => {
await supabase.auth.signOut()
}

return (
\<AuthContext.Provider value={{ user, loading, signOut }}>
{children}
\</AuthContext.Provider>
)
}

export const useAuth = () => {
const context = useContext(AuthContext)
if (!context) throw new Error('useAuth must be used within AuthProvider')
return context
}
