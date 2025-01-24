import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, signOut } from '../services/supabase'
import { getCurrentPoints, getUpgradeStatus, completeTask, EVENTS } from '../services/points'

interface Task {
  id: string
  title: string
  description: string
  icon: string
  points: number
  link: string
}

const tasks: Task[] = [
  {
    id: 'github',
    title: 'Follow Dev Github',
    description: 'Follow developer on GitHub',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#10B981" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
    points: 10,
    link: 'https://github.com/Kallolx'
  },
  {
    id: 'portfolio',
    title: 'Visit Dev Portfolio',
    description: 'Check out developer portfolio',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#10B981" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z"/></svg>`,
    points: 10,
    link: 'https://kallolsfolio.vercel.app/'
  }
]

export default function Settings() {
  const [user, setUser] = useState<any>(null)
  const [points, setPoints] = useState(0)
  const [upgradeStatus, setUpgradeStatus] = useState<any>({
    isPro: false,
    tasksCompleted: 0,
    totalTasks: 2,
    unlockedFeatures: []
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadUserData()
    
    // Listen for points and upgrade status updates
    const handlePointsUpdate = (e: CustomEvent<number>) => {
      setPoints(e.detail)
    }

    const handleUpgradeUpdate = (e: CustomEvent<any>) => {
      setUpgradeStatus(e.detail)
    }

    // Add event listeners
    window.addEventListener(EVENTS.POINTS_UPDATE, handlePointsUpdate as EventListener)
    window.addEventListener(EVENTS.UPGRADE_STATUS, handleUpgradeUpdate as EventListener)

    return () => {
      window.removeEventListener(EVENTS.POINTS_UPDATE, handlePointsUpdate as EventListener)
      window.removeEventListener(EVENTS.UPGRADE_STATUS, handleUpgradeUpdate as EventListener)
    }
  }, [])

  const loadUserData = async () => {
    const user = await getCurrentUser()
    setUser(user)
    if (user) {
      const currentPoints = await getCurrentPoints()
      const status = await getUpgradeStatus()
      setPoints(currentPoints)
      setUpgradeStatus(status)
    }
  }

  const handleTaskClick = async (task: Task) => {
    window.open(task.link, '_blank')
    setTimeout(async () => {
      const success = await completeTask(task.id, task.points)
      if (success) {
        // Refresh upgrade status and points after completing task
        const newStatus = await getUpgradeStatus()
        const newPoints = await getCurrentPoints()
        setUpgradeStatus(newStatus)
        setPoints(newPoints)
      }
    }, 1000)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-900 pt-24 pb-24 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-medium text-white mb-4">Sign in to view settings</h2>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-primary/90 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-24">
      <div className="max-w-xl mx-auto px-4">
        {/* Profile Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-accent-primary/20">
              <img
                src={user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces&auto=format&q=80"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white mb-1">
                {user.user_metadata?.full_name || 'User'}
              </h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
              {upgradeStatus.isPro && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-accent-primary/10 text-accent-primary mt-2">
                  PRO
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Credits Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4">Credits</h2>
          <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-4 ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300">Available Credits</span>
              <div className="flex items-center">
                <span className="text-2xl font-semibold text-accent-primary">{points}</span>
                {upgradeStatus.isPro && (
                  <span className="ml-2 text-sm text-accent-primary">∞</span>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {upgradeStatus.isPro ? 'Unlimited credits with PRO!' : 'Complete tasks below to earn more credits!'}
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4">Earn Credits</h2>
          <div className="space-y-3">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => handleTaskClick(task)}
                disabled={upgradeStatus.completedTasks?.includes(task.id)}
                className="w-full px-4 py-3 rounded-xl bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5 hover:ring-accent-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg ${upgradeStatus.completedTasks?.includes(task.id) ? 'bg-accent-primary/10' : 'bg-dark-800'} flex items-center justify-center`}>
                      {upgradeStatus.completedTasks?.includes(task.id) ? (
                        <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: task.icon }} />
                      )}
                    </div>
                    <div className="text-left">
                      <span className="text-gray-300 block">{task.title}</span>
                      <span className="text-sm text-gray-500">{task.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${upgradeStatus.completedTasks?.includes(task.id) ? 'text-accent-primary' : 'text-gray-400'}`}>
                      {upgradeStatus.completedTasks?.includes(task.id) ? 'Completed' : `+${task.points} credits`}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                      <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upgrade Progress */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4">
            {upgradeStatus.isPro ? 'PRO Features' : 'Upgrade Progress'}
          </h2>
          <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/5">
            {upgradeStatus.isPro ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Unlocked Features</h3>
                  <span className="text-accent-primary font-medium">PRO</span>
                </div>
                <div className="space-y-3">
                  {upgradeStatus.unlockedFeatures.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-medium mb-1">Pro Upgrade</h3>
                    <p className="text-sm text-gray-400">Complete tasks to unlock PRO features</p>
                  </div>
                  <span className="text-accent-primary font-medium">{upgradeStatus.tasksCompleted}/{upgradeStatus.totalTasks} Tasks</span>
                </div>
                <div className="w-full h-2 bg-dark-800 rounded-full mb-6">
                  <div 
                    className="h-full bg-accent-primary rounded-full transition-all duration-500"
                    style={{ width: `${(upgradeStatus.tasksCompleted / upgradeStatus.totalTasks) * 100}%` }}
                  />
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-lg bg-dark-800 flex items-center justify-center">
                      <span className="text-gray-400">∞</span>
                    </div>
                    <span className="text-gray-300">Unlimited daily points</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-lg bg-dark-800 flex items-center justify-center">
                      <span className="text-gray-400">⚡</span>
                    </div>
                    <span className="text-gray-300">Priority analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-lg bg-dark-800 flex items-center justify-center">
                      <span className="text-gray-400">📊</span>
                    </div>
                    <span className="text-gray-300">Advanced statistics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-lg bg-dark-800 flex items-center justify-center">
                      <span className="text-gray-400">🤖</span>
                    </div>
                    <span className="text-gray-300">Custom AI responses</span>
                  </div>
                </div>
                <button 
                  disabled={upgradeStatus.tasksCompleted < upgradeStatus.totalTasks}
                  className={`w-full px-6 py-3 rounded-xl ${
                    upgradeStatus.tasksCompleted < upgradeStatus.totalTasks 
                      ? 'bg-accent-primary/50 cursor-not-allowed' 
                      : 'bg-accent-primary hover:bg-accent-primary/90'
                  } text-white font-medium transition-colors`}
                >
                  {upgradeStatus.tasksCompleted < upgradeStatus.totalTasks 
                    ? `Complete ${upgradeStatus.totalTasks - upgradeStatus.tasksCompleted} more tasks` 
                    : 'Upgrade Now'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 rounded-xl bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5 text-gray-400 hover:text-white hover:ring-accent-primary/20 transition-all"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
} 