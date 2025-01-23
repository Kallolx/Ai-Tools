import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface Tool {
  id: string
  title: string
  description: string
  iconUrl: string
  color: string
}

export const tools: Tool[] = [
  {
    id: 'garbage-sorter',
    title: 'Garbage Sorter',
    description: 'AI-powered waste classification',
    iconUrl: '/icons/garbage.png',
    color: 'from-emerald-500/20 to-emerald-500/5'
  },
  {
    id: 'energy',
    title: 'Energy Analysis',
    description: 'Optimize your energy usage with AI',
    iconUrl: '/icons/energy.png',
    color: 'from-amber-500/20 to-amber-500/5'
  },
  {
    id: 'special-tutor',
    title: 'Special Needs Tutor',
    description: 'Personalized AI tutoring system adapted for children with learning disabilities',
    iconUrl: '/icons/special.png',
    color: 'from-blue-500/20 to-blue-500/5'
  },
  {
    id: 'medication',
    title: 'Med Tracker',
    description: 'Smart medication tracking and reminders for better health management',
    iconUrl: '/icons/medi.png',
    color: 'from-red-500/20 to-red-500/5'
  },
  {
    id: 'news-detector',
    title: 'Fake News Detector',
    description: 'AI-powered system to identify and flag potential misinformation',
    iconUrl: '/icons/news.png',
    color: 'from-purple-500/20 to-purple-500/5'
  },
  {
    id: 'remote-health',
    title: 'Remote Health',
    description: 'AI-assisted remote health diagnosis and monitoring system',
    iconUrl: '/icons/health.png',
    color: 'from-teal-500/20 to-teal-500/5'
  }
]

const CircleAnimation = () => (
  <div className="relative w-32 h-32">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border-2 border-accent-primary/20" />
    </div>
    <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
      <div className="w-28 h-28 rounded-full border-2 border-transparent border-t-accent-primary/40" />
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-accent-primary animate-pulse" />
    </div>
  </div>
)


const AudioVisualizer = ({ analyzer }: { analyzer: AnalyserNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const bufferLength = analyzer.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      analyzer.getByteTimeDomainData(dataArray)
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      
      const sliceWidth = canvas.width / bufferLength
      let x = 0
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        
        x += sliceWidth
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.strokeStyle = '#10B981'
      ctx.lineWidth = 2
      ctx.stroke()
      
      animationRef.current = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [analyzer])
  
  return (
    <div className="fixed left-0 right-0 bottom-24 md:bottom-28 flex items-center justify-center">
      <div className="bg-dark-800/90 backdrop-blur-lg p-3 rounded-2xl mx-4">
        <canvas 
          ref={canvasRef} 
          width={180} 
          height={50} 
          className="w-[180px] h-[50px]"
        />
      </div>
    </div>
  )
}

const Home = () => {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false)
  const [hasSplineError, setHasSplineError] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null)
  const mediaStreamRef = useRef<MediaStream>()
  const audioContextRef = useRef<AudioContext>()
  const navigate = useNavigate()

  const startRecording = useCallback(async () => {
    try {
      if (audioContextRef.current?.state === 'running') {
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const newAnalyzer = audioContext.createAnalyser()
      
      newAnalyzer.fftSize = 256
      source.connect(newAnalyzer)
      
      audioContextRef.current = audioContext
      setAnalyzer(newAnalyzer)
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = undefined
    }
    if (audioContextRef.current?.state === 'running') {
      audioContextRef.current.close()
      audioContextRef.current = undefined
    }
    setAnalyzer(null)
    setIsRecording(false)
  }, [])

  useEffect(() => {
    const loadSpline = async () => {
      try {
        if (!document.querySelector('script[src*="splinetool"]')) {
          const script = document.createElement('script')
          script.type = 'module'
          script.src = 'https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js'
          
          script.onload = () => setIsSplineLoaded(true)
          script.onerror = () => setHasSplineError(true)
          
          document.body.appendChild(script)
        } else {
          setIsSplineLoaded(true)
        }
      } catch (error) {
        setHasSplineError(true)
      }
    }

    loadSpline()

    return () => {
      const script = document.querySelector('script[src*="splinetool"]')
      if (script) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleToolClick = (toolId: string) => {
    if (toolId === 'garbage-sorter') {
      navigate('/upload')
    } else if (toolId === 'energy') {
      navigate('/energy')
    }
  }

  return (
    <div className="flex flex-col space-y-6 pb-24">
      {/* 3D Model Section */}
      <div className="relative h-[280px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/50 to-dark-900/20 z-0" />
        <div className="absolute inset-0">
          {!isSplineLoaded && !hasSplineError && (
            <div className="flex items-center justify-center h-full">
              <CircleAnimation />
            </div>
          )}
          {!hasSplineError && (
            <spline-viewer 
              url="https://prod.spline.design/6Jd-zkzBMZsBusM2/scene.splinecode"
              className={`w-full h-[280px] transition-opacity duration-500 ${isSplineLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ pointerEvents: 'none' }}
            />
          )}
          {hasSplineError && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <div className="w-16 h-16 rounded-full bg-dark-800/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">Interactive 3D model unavailable</p>
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-6 left-6 z-10">
          <button 
            onPointerDown={startRecording}
            onPointerUp={stopRecording}
            onPointerLeave={stopRecording}
            className="relative bg-dark-800/40 backdrop-blur-sm px-4 py-2 rounded-2xl ring-1 ring-white/10 flex items-center space-x-2 hover:bg-dark-800/60 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors ${isRecording ? 'text-red-500' : 'text-accent-primary'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-white">Hold to talk</span>
            {isRecording && analyzer && <AudioVisualizer analyzer={analyzer} />}
          </button>
        </div>
      </div>

      {/* Explore Section */}
      <div className="px-4 space-y-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Explore</h2>
          <a 
            href="/all-tools" 
            className="flex items-center space-x-1 text-accent-primary hover:text-accent-primary/80 transition-colors"
          >
            <span className="text-sm font-medium">View All</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className="group bg-dark-800/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 ring-1 ring-white/5 hover:ring-accent-primary/20 transition-all hover:-translate-y-0.5 cursor-pointer min-h-[160px] md:min-h-[180px]"
            >
              <div className="flex flex-col h-full">
                <div className="transition-transform group-hover:scale-110 mb-3 md:mb-4">
                  <img 
                    src={tool.iconUrl} 
                    alt={tool.title}
                    className="w-12 h-12 md:w-10 md:h-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-[15px] mb-2">{tool.title}</h3>
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

export default Home 