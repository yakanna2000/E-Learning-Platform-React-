import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const Context = createContext(null)

export const useApp = () => useContext(Context)

export function AppProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [message, setMessage] = useState('')

  const loadProfile = async (user) => {
    if (!supabase || !user) {
      setProfile(null)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Profile loading error:', error)
      setProfile(null)
      return
    }

    setProfile(data)
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let mounted = true

    async function initialize() {
      const {
        data: { session: currentSession }
      } = await supabase.auth.getSession()

      if (!mounted) return

      setSession(currentSession)

      if (currentSession?.user) {
        await loadProfile(currentSession.user)
      }

      setLoading(false)
    }

    initialize()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)

      if (newSession?.user) {
        await loadProfile(newSession.user)
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const flash = (text) => {
    setMessage(text)

    window.setTimeout(() => {
      setMessage('')
    }, 3500)
  }

  return (
    <Context.Provider
      value={{
        session,
        profile,
        loading,
        flash,
        reloadProfile: () => loadProfile(session?.user)
      }}
    >
      {children}

      {message && (
        <div className="toast" role="status">
          {message}
        </div>
      )}
    </Context.Provider>
  )
}