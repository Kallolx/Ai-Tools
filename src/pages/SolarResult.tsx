import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface AnalysisResult {
  suitability: number
  potentialOutput: string
  recommendations: string[]
  roofArea: string
  estimatedCost: string
  annualSavings: string
}

const SuitabilityMeter = ({ score }: { score: number }) => {
  const [width, setWidth] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(score)
    }, 300)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Suitability Score</span>
        <span className="text-sm font-medium text-white">{score}%</span>
      </div>
      <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent-primary transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

const SolarResult = () => {
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
            onClick={() => navigate('/energy/solar')}
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
            onClick={() => navigate('/energy/solar')}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5 hover:ring-accent-primary/20 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Solar Analysis Result</h1>
            <p className="text-sm text-gray-400 mt-0.5">Here's what we found about your roof</p>
          </div>
        </div>

        {/* Content */}
        <div className={`space-y-4 transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Image Preview */}
          {imageUrl && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-dark-800/50 backdrop-blur-sm ring-1 ring-white/5">
              <img 
                src={imageUrl} 
                alt="Analyzed roof"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          )}

          {/* Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Suitability Score */}
            <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/5">
              <SuitabilityMeter score={result.suitability} />
            </div>

            {/* Potential Output */}
            <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/5">
              <h3 className="text-white font-medium mb-2">Potential Output</h3>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-accent-primary">
                  <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
                </svg>
                <span className="text-2xl font-bold text-white">{result.potentialOutput}</span>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/5">
              <h3 className="text-white font-medium mb-4">Specifications</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Roof Area</p>
                  <p className="text-white font-medium">{result.roofArea}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estimated Cost</p>
                  <p className="text-white font-medium">{result.estimatedCost}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Annual Savings</p>
                  <p className="text-white font-medium">{result.annualSavings}</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/5">
              <h3 className="text-white font-medium mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((tip, index) => (
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
              onClick={() => navigate('/energy/solar')}
              className="flex-1 py-3 rounded-xl bg-dark-800 text-white font-medium hover:bg-dark-800/80 transition-colors"
            >
              Analyze Another
            </button>
            <button
              onClick={() => navigate('/energy')}
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

export default SolarResult 