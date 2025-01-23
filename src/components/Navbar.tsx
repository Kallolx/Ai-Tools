const Navbar = () => {
  return (
    <header className="bg-dark-900 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-accent-primary/20">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces&auto=format&q=80" 
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Hi,</p>
              <h2 className="font-semibold text-[15px]">Kallol 👋</h2>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 bg-dark-800/50 rounded-full px-3 py-1.5 ring-1 ring-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-sm font-medium text-gray-200">100 Credits</span>
            </div>
            <button className="w-8 h-8 bg-dark-800/50 rounded-full flex items-center justify-center ring-1 ring-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar 