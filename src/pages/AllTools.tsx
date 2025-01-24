import { tools } from '../components/Home'
import { useNavigate } from 'react-router-dom'

const AllTools = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5 hover:ring-accent-primary/20 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">All AI Tools</h1>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-4 py-2 rounded-xl bg-accent-primary text-white text-sm font-medium whitespace-nowrap">
            All Tools
          </button>
          <button className="px-4 py-2 rounded-xl bg-dark-800/50 text-gray-400 text-sm font-medium whitespace-nowrap hover:text-white transition-colors">
            Healthcare
          </button>
          <button className="px-4 py-2 rounded-xl bg-dark-800/50 text-gray-400 text-sm font-medium whitespace-nowrap hover:text-white transition-colors">
            Education
          </button>
          <button className="px-4 py-2 rounded-xl bg-dark-800/50 text-gray-400 text-sm font-medium whitespace-nowrap hover:text-white transition-colors">
            Environment
          </button>
          <button className="px-4 py-2 rounded-xl bg-dark-800/50 text-gray-400 text-sm font-medium whitespace-nowrap hover:text-white transition-colors">
            Productivity
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input 
            type="text"
            placeholder="Search tools..."
            className="w-full h-12 px-4 pl-11 rounded-2xl bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5 focus:ring-accent-primary/20 text-white placeholder-gray-500 outline-none transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              className="group bg-dark-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-5 ring-1 ring-white/5 hover:ring-accent-primary/20 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex flex-col h-full">
                <div className="transition-transform group-hover:scale-110 mb-3">
                  <img 
                    src={tool.iconUrl} 
                    alt={tool.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-[15px] mb-1.5">{tool.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{tool.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllTools
