import { useState, useRef, useEffect } from 'react'
import { IoCamera } from 'react-icons/io5'
import { IoImagesOutline } from 'react-icons/io5'
import './App.css'

// Backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

if (!BACKEND_URL) {
  throw new Error('VITE_BACKEND_URL is not set in environment variables')
}

interface AnalysisResult {
  category: string;
  instruction: string;
}

function parseAnalysis(markdownText: string): AnalysisResult[] {
  if (!markdownText) return [];
  
  const lines = markdownText.split('\n');
  const results: AnalysisResult[] = [];
  
  let currentCategory = '';
  
  lines.forEach(line => {
    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '');
    } else if (line.startsWith('• ')) {
      const instruction = line.replace('• ', '').replace('[', '').replace(']', '');
      if (currentCategory && instruction) {
        results.push({
          category: currentCategory,
          instruction: instruction
        });
      }
    }
  });
  
  return results;
}

function App() {
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [error, setError] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)
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
    setAnalysis('')

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
        // Show error cross briefly, then display the message
        setTimeout(() => {
          setShowError(false)
          setAnalysis(`## Error\n\n${data.message}`)
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

  const renderAnalysisTable = (analysisText: string) => {
    // If it's an error message, display it differently
    if (analysisText.startsWith('## Error')) {
      return (
        <div className="error">
          {analysisText.replace('## Error\n\n', '')}
        </div>
      );
    }

    const results = parseAnalysis(analysisText);
    
    return (
      <table className="analysis-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Instruction</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.category}</td>
              <td>{result.instruction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
          <small>Please make sure the backend server is started with the host flag and VITE_BACKEND_URL is set properly in frontend/.env.local.</small>
        </div>
      )}
      
      {imagePreview && (
        <div className="image-preview">
          <img 
            src={imagePreview} 
            alt="Laundry care label" 
            className={analysis ? 'blurred' : ''}
          />
          {(loading || showSuccess || showError) && (
            <div className="image-overlay">
              {loading && <div className="loading" />}
              {showSuccess && <div className="success-check" />}
              {showError && <div className="error-cross" />}
            </div>
          )}
          {analysis && (
            <div className="analysis-overlay">
              {renderAnalysisTable(analysis)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
