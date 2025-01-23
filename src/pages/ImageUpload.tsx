import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeWasteImage } from '../services/gemini'

const ImageUpload = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [hasCamera, setHasCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()

  // Check if device has camera
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setHasCamera(videoDevices.length > 0)
      } catch (err) {
        console.error('Error checking camera:', err)
        setHasCamera(false)
      }
    }

    checkCamera()
  }, [])

  // Camera handling functions
  const startCamera = async () => {
    try {
      // First check if we have permission
      const permissionResult = await navigator.permissions.query({ name: 'camera' as PermissionName })
      
      if (permissionResult.state === 'denied') {
        setError('Camera permission was denied. Please enable camera access in your browser settings.')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraOpen(true)
        setError(null)
      }
    } catch (err) {
      console.error('Camera error:', err)
      if ((err as Error).name === 'NotFoundError' || (err as Error).name === 'DevicesNotFoundError') {
        setError('No camera found on your device.')
      } else if ((err as Error).name === 'NotAllowedError' || (err as Error).name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access and try again.')
      } else if ((err as Error).name === 'NotReadableError' || (err as Error).name === 'TrackStartError') {
        setError('Camera is in use by another application.')
      } else {
        setError('Unable to access camera. Please check permissions or try a different device.')
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsCameraOpen(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
            setImageFile(file)
            setImage(canvas.toDataURL('image/jpeg'))
            stopCamera()
          }
        }, 'image/jpeg')
      }
    }
  }

  // Existing functions
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setError(null)
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setError('Please upload an image file (JPG, PNG)')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    processFile(file)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return

    try {
      setIsAnalyzing(true)
      setError(null)
      const result = await analyzeWasteImage(imageFile)
      navigate('/result', { state: { result, imageUrl: image } })
    } catch (error) {
      setError('Failed to analyze image. Please try again.')
      setIsAnalyzing(false)
    }
  }, [imageFile, image, navigate])

  return (
    <div className="min-h-screen bg-dark-900 pt-4 pb-24">
      <div className="px-4 max-w-3xl mx-auto">
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
            <h1 className="text-xl font-bold text-white">Garbage Sorting</h1>
            <p className="text-sm text-gray-400 mt-0.5">Upload or take a photo to identify waste type</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-4 ring-1 ring-white/5 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-accent-primary">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">How it works</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Take a clear photo or upload an image of the waste item you want to sort. Our AI will analyze it and tell you which bin it belongs in.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 text-red-500 px-4 py-3 rounded-xl text-sm mb-4">
            <div className="flex items-start space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Camera View */}
        {isCameraOpen && (
          <div className="relative rounded-2xl overflow-hidden mb-4 bg-dark-800/50">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button
                onClick={capturePhoto}
                className="px-4 py-2 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-primary/90 transition-colors"
              >
                Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl bg-dark-800 text-white font-medium hover:bg-dark-800/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Upload Zone */}
        {!isCameraOpen && (
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative group rounded-2xl min-h-[300px] ring-2 ring-dashed transition-all ${
              isDragging 
                ? 'ring-accent-primary bg-accent-primary/5' 
                : 'ring-white/10 hover:ring-accent-primary/30 bg-dark-800/50'
            }`}
          >
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              {!image ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-dark-800 ring-1 ring-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-accent-primary">
                      <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white font-medium mb-2">Drop your image here</p>
                  <p className="text-sm text-gray-400 text-center mb-4">
                    or click to browse<br />
                    Supports: JPG, PNG
                  </p>
                  {hasCamera && (
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 rounded-xl bg-dark-800 text-white font-medium hover:bg-dark-800/80 transition-colors"
                    >
                      Open Camera
                    </button>
                  )}
                </>
              ) : (
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full h-full object-contain rounded-xl"
                />
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        {image && !isCameraOpen && (
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => {
                setImage(null)
                setImageFile(null)
              }}
              className="flex-1 py-3 rounded-xl bg-dark-800 text-white font-medium hover:bg-dark-800/80 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 py-3 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUpload 