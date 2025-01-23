import { useNavigate } from 'react-router-dom'

interface AnalysisOption {
  id: string
  title: string
  description: string
  iconUrl: string
  color: string
  comingSoon?: boolean
}

const EnergyAnalysis = () => {
  const navigate = useNavigate()

  const analysisOptions: AnalysisOption[] = [
    {
      id: 'solar',
      title: 'Solar Analysis',
      description: 'Analyze your roof for solar panel potential',
      iconUrl: '/icons/solar.png',
      color: 'from-amber-500/20 to-amber-500/5'
    },
    {
      id: 'usage',
      title: 'Usage Analysis',
      description: 'Analyze your energy consumption patterns',
      iconUrl: '/icons/usage.png',
      color: 'from-emerald-500/20 to-emerald-500/5',
      comingSoon: true
    },
    {
      id: 'efficiency',
      title: 'Home Efficiency',
      description: 'Identify energy inefficiencies in your home',
      iconUrl: '/icons/efficiency.png',
      color: 'from-blue-500/20 to-blue-500/5',
      comingSoon: true
    },
    {
      id: 'smart',
      title: 'Smart Devices',
      description: 'Optimize your smart device scheduling',
      iconUrl: '/icons/devices.png',
      color: 'from-purple-500/20 to-purple-500/5',
      comingSoon: true
    }
  ]

  return (
    <div className="flex flex-col space-y-6 pb-24">
      <div className="px-4 space-y-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-4 mb-2">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5 hover:ring-accent-primary/20 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Energy Analysis</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {analysisOptions.map((option) => (
            <div 
              key={option.id}
              onClick={() => !option.comingSoon && navigate(`/energy/${option.id}`)}
              className={`group bg-dark-800/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 ring-1 ring-white/5 hover:ring-accent-primary/20 transition-all hover:-translate-y-0.5 cursor-pointer min-h-[160px] md:min-h-[180px] ${
                option.comingSoon ? 'opacity-60' : ''
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="transition-transform group-hover:scale-110 mb-3 md:mb-4">
                  <img 
                    src={option.iconUrl} 
                    alt={option.title}
                    className="w-12 h-12 md:w-10 md:h-10 object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-white text-[15px]">{option.title}</h3>
                    {option.comingSoon && (
                      <span className="text-xs font-medium text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{option.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-accent-primary">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Why use AI for energy analysis?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Our AI analyzes your specific energy usage patterns, environmental conditions, and property characteristics to provide personalized recommendations that can help reduce your energy consumption and costs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnergyAnalysis 