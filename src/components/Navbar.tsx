import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { initializePoints, getCurrentPoints, EVENTS } from '../services/points'
import { onAuthStateChange } from '../services/supabase'

export default function Navbar() {
  const [points, setPoints] = useState(10)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize points on component mount
    const loadPoints = async () => {
      const initialPoints = await initializePoints()
      setPoints(initialPoints)
    }
    loadPoints()

    // Listen for point updates with the new custom event
    const handlePointsUpdate = (e: CustomEvent<number>) => {
      console.log('Points update received:', e.detail)
      setPoints(e.detail)
    }

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange(async (user) => {
      setUser(user)
      if (user) {
        const currentPoints = await getCurrentPoints()
        setPoints(currentPoints)
      }
    })

    // Add event listeners
    window.addEventListener(EVENTS.POINTS_UPDATE, handlePointsUpdate as EventListener)

    return () => {
      window.removeEventListener(EVENTS.POINTS_UPDATE, handlePointsUpdate as EventListener)
      subscription.unsubscribe()
    }
  }, [])

  const handleLogin = () => {
    navigate('/login')
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-dark-900 border-b border-white/5 z-40">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="w-8 h-8 rounded-xl overflow-hidden">
              <img
                src={user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces&auto=format&q=80"}
                alt="User"
                className="w-full h-full object-cover ring-2 ring-accent-primary/20"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-dark-800 ring-1 ring-white/5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
            </div>
          )}
          <span className="text-[15px] text-white">
            {user ? `Hi, ${user.user_metadata?.full_name?.split(' ')[0] || 'User'} 👋` : 'Welcome 👋'}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-200">
            {user ? (
              <>
                <span className="text-sm">Credits:</span>
                <div className="px-3 py-1 rounded-lg bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5">
                  <span className="text-accent-primary font-medium">{points}</span>
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5 hover:ring-accent-primary/20 transition-all"
              >
                <span className="text-accent-primary font-medium">Free</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-accent-primary">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {user ? (
            <button
              onClick={handleSettings}
              className="w-8 h-8 rounded-xl bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5 flex items-center justify-center hover:ring-accent-primary/20 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652z" />
                <path fillRule="evenodd" d="M10 13a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="px-4 py-1.5 rounded-xl bg-accent-primary text-white text-sm font-medium hover:bg-accent-primary/90 transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  )
} 