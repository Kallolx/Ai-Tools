import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import Home from './components/Home'
import AllTools from './pages/AllTools'
import ImageUpload from './pages/ImageUpload'
import AnalysisResult from './pages/AnalysisResult'

const AppContent = () => {
  const [currentTab, setCurrentTab] = useState('home')
  const location = useLocation()

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId)
    // Handle camera visibility here if needed
  }

  // Show BottomNav everywhere except specific pages
  const hideBottomNav = ['/login', '/signup'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="pt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-tools" element={<AllTools />} />
          <Route path="/upload" element={<ImageUpload />} />
          <Route path="/result" element={<AnalysisResult />} />
        </Routes>
      </main>
      {!hideBottomNav && <BottomNav onTabChange={handleTabChange} />}
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App