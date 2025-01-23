import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { AnalysisResult } from '../services/gemini'

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'Recyclable':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-emerald-500 animate-spin-slow">
          <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
        </svg>
      )
    case 'Compostable':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-amber-500 animate-bounce-slow">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
        </svg>
      )
    case 'Non-Recyclable':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500 animate-pulse">
          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
        </svg>
      )
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        </svg>
      )
  }
}

const ConfidenceBar = ({ confidence }: { confidence: string }) => {
  const [width, setWidth] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      switch (confidence.toLowerCase()) {
        case 'high':
          setWidth(100)
          break
        case 'medium':
          setWidth(65)
          break
        case 'low':
          setWidth(30)
          break
        default:
          setWidth(50)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [confidence])

  return (
    <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-accent-primary transition-all duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

const AnalysisResult = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result as AnalysisResult
  const imageUrl = location.state?.imageUrl as string
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!result) {
    return (
      <div className="min-h-screen bg-dark-900 pt-4 pb-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">No analysis result found</p>
          <button
            onClick={() => navigate('/upload')}
            className="mt-4 px-4 py-2 bg-accent-primary text-white rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-4 pb-24">
      <div className="px-4 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button 
            onClick={() => navigate('/upload')}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5 hover:ring-accent-primary/20 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Analysis Result</h1>
            <p className="text-sm text-gray-400 mt-0.5">Here's what we found about your waste item</p>
          </div>
        </div>

        {/* Content */}
        <div className={`space-y-4 transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Image Preview */}
          {imageUrl && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5">
              <img 
                src={imageUrl} 
                alt="Analyzed waste"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          )}

          {/* Result Card */}
          <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/5">
            {/* Category */}
            <div className="flex items-center space-x-3 mb-4">
              <CategoryIcon category={result.category} />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">{result.category}</h2>
                <div className="mt-2">
                  <ConfidenceBar confidence={result.confidence} />
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-2">Explanation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{result.explanation}</p>
            </div>

            {/* Tips */}
            <div>
              <h3 className="text-white font-medium mb-2">Disposal Tips</h3>
              <ul className="space-y-2">
                {result.tips.map((tip, index) => (
                  <li 
                    key={index} 
                    className="flex items-start space-x-2 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-400">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/upload')}
              className="flex-1 py-3 rounded-xl bg-dark-800 text-white font-medium hover:bg-dark-800/80 transition-colors"
            >
              Analyze Another
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisResult 