import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { IoCamera } from 'react-icons/io5'
import { IoImagesOutline } from 'react-icons/io5'
import './App.css'

// Backend URL using local IP address
const BACKEND_URL = 'http://192.168.1.159:8000'

function App() {
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [error, setError] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)
  const [isInvalidImage, setIsInvalidImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check if device is mobile
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /mobile|android|ios|iphone|ipad|ipod|windows phone/i.test(userAgent)
      setIsMobile(isMobileDevice)
    }

    checkDevice()
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create image preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setLoading(true)
    setError('')
    setShowSuccess(false)
    setShowError(false)
    setValidationMessage('')
    setAnalysis('')
    setIsInvalidImage(false)

    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('Sending request to backend...')
      const response = await fetch(`${BACKEND_URL}/analyze-label`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.detail || `Server error: ${response.status} ${response.statusText}`
        )
      }

      const data = await response.json()
      
      if (!data.valid) {
        setLoading(false)
        setShowError(true)
        setValidationMessage(data.message)
        // Show error cross briefly, then keep the message
        setTimeout(() => {
          setShowError(false)
          setIsInvalidImage(true)
        }, 1500)
        return
      }

      // Show success animation briefly before showing analysis
      setLoading(false)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setAnalysis(data.analysis)
      }, 1000)

    } catch (err) {
      console.error('Error details:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the image')
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1>AI Laundry Advisor</h1>
      
      <div className="upload-section">
        {/* File Upload Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        
        {/* Camera Input */}
        {isMobile && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            ref={cameraInputRef}
            style={{ display: 'none' }}
            capture="environment"
          />
        )}
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          title="Upload from gallery"
        >
          <IoImagesOutline size={24} />
        </button>
        
        {isMobile && (
          <button 
            onClick={() => cameraInputRef.current?.click()}
            title="Take photo"
          >
            <IoCamera size={24} />
          </button>
        )}
      </div>
      
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
          <br />
          <small>Please make sure the backend server is running at {BACKEND_URL}</small>
        </div>
      )}
      
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Laundry care label" />
          {(loading || showSuccess || showError) && (
            <div className="image-overlay">
              {loading && <div className="loading" />}
              {showSuccess && <div className="success-check" />}
              {showError && <div className="error-cross" />}
            </div>
          )}
          {isInvalidImage && (
            <div className="error-overlay">
              <div className="validation-message">{validationMessage}</div>
            </div>
          )}
        </div>
      )}
      
      {analysis && (
        <div className="analysis-result">
          <div className="instructions-container">
            <ReactMarkdown className="markdown-content">
              {analysis}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
