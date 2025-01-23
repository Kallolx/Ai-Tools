import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ChatPage from '../pages/ChatPage'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isChatOpen, setIsChatOpen] = useState(false)

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'tools',
      label: 'Tools',
      path: '/all-tools',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M3.75 2A1.75 1.75 0 002 3.75v3.5C2 8.216 2.784 9 3.75 9h3.5A1.75 1.75 0 009 7.25v-3.5A1.75 1.75 0 007.25 2h-3.5zM3.75 11A1.75 1.75 0 002 12.75v3.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 009 16.25v-3.5A1.75 1.75 0 007.25 11h-3.5zm7.5-9A1.75 1.75 0 0010 3.75v3.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0017 7.25v-3.5A1.75 1.75 0 0015.25 2h-3.5zm0 9A1.75 1.75 0 0010 12.75v3.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0017 16.25v-3.5A1.75 1.75 0 0015.25 11h-3.5z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'chat',
      label: 'AI Chat',
      isSpecial: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      )
    },
    {
      id: 'history',
      label: 'History',
      path: '/history',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.id === 'chat') {
      setIsChatOpen(true)
    } else if (tab.path) {
      navigate(tab.path)
    }
  }

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-800/50 backdrop-blur-lg border-t border-white/5 z-40">
        <div className="px-4 h-20 max-w-7xl mx-auto flex items-center justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center ${tab.isSpecial ? '-mt-8' : ''}`}
            >
              <div
                className={`flex flex-col items-center justify-center ${
                  tab.isSpecial 
                    ? 'w-16 h-16 rounded-2xl bg-accent-primary shadow-lg shadow-accent-primary/25 flex items-center justify-center' 
                    : 'w-16 h-16'
                } ${
                  !tab.isSpecial && ((tab.path === '/' ? location.pathname === '/' : tab.path && location.pathname.includes(tab.path)) || (tab.id === 'chat' && isChatOpen))
                    ? 'text-accent-primary'
                    : tab.isSpecial ? 'text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.icon}
                <span className={`text-xs mt-1 ${tab.isSpecial ? 'text-accent-primary font-medium absolute -bottom-5' : ''}`}>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <ChatPage isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
} 