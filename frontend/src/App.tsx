import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('Sending request to backend...')
      const response = await fetch('http://localhost:8000/analyze-label', {
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

  const handleCameraCapture = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="app-container">
      <h1>AI Laundry Advisor</h1>
      
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
          capture="environment"
        />
        
        <button onClick={() => fileInputRef.current?.click()}>
          Upload Image
        </button>
        
        <button onClick={handleCameraCapture}>
          Take Photo
        </button>
      </div>

      {loading && <div className="loading">Analyzing image...</div>}
      
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
          <br />
          <small>Please make sure the backend server is running at http://localhost:8000</small>
        </div>
      )}
      
      {analysis && (
        <div className="analysis-result">
          <h2>Washing Instructions:</h2>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  )
}

export default App
