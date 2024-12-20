import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { IoCamera } from 'react-icons/io5'
import { IoImagesOutline } from 'react-icons/io5'
import './App.css'

// Backend URL using local IP address
const BACKEND_URL = 'http://192.168.1.159:8000'

function App() {
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

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
      if (!data.analysis) {
        throw new Error('No analysis received from server')
      }
      setAnalysis(data.analysis)
    } catch (err) {
      console.error('Error details:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the image')
    } finally {
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
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          ref={cameraInputRef}
          style={{ display: 'none' }}
          capture="environment"
        />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          title="Upload from gallery"
        >
          <IoImagesOutline size={24} />
        </button>
        
        <button 
          onClick={() => cameraInputRef.current?.click()}
          title="Take photo"
        >
          <IoCamera size={24} />
        </button>
      </div>

      {loading && <div className="loading" />}
      
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
