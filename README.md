# AI Laundry Advisor

AI Laundry Advisor is a tool that helps you understand the washing label on your clothes and find the most appropriate way for cleaning them.

## Features
- Take a photo or upload an image of a laundry care label
- Get instant analysis using OpenAI's Vision API
- Receive clear, concise washing instructions
- Mobile-friendly interface

## Prerequisites
- Python 3.7+
- Node.js and npm
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd ai-laundry-advisor
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Running the App

### Desktop Usage

1. Start the backend server (from the root directory):
```bash
uvicorn main:app --reload
```

2. Start the frontend development server (in a new terminal):
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to:
   - Frontend: http://localhost:5173
   - Backend health check: http://localhost:8000/health

### Mobile Access (Phone)

To access the app from your phone:

1. Make sure your computer and phone are on the same WiFi network

2. Find your computer's local IP address:
   - On Mac/Linux: `ipconfig getifaddr en0` or `ip addr show`
   - On Windows: `ipconfig` and look for IPv4 Address

3. Update the frontend code:
   - Open `frontend/src/App.tsx`
   - Change the `BACKEND_URL` to use your computer's IP address:
     ```typescript
     const BACKEND_URL = 'http://your.ip.address:8000'
     ```

4. Start the backend server with host access:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

5. Start the frontend server with host access:
```bash
cd frontend
npm run dev -- --host
```

6. On your phone:
   - Open your browser
   - Navigate to `http://your.ip.address:5173`
   - Allow camera access if you want to take photos

## Usage

1. Click "Upload Image" to select an image from your device or "Take Photo" to use your camera
2. Wait for the analysis (usually takes a few seconds)
3. View the washing instructions, which include:
   - Water temperature
   - Washing method
   - Drying instructions
   - Ironing recommendations
   - Special care instructions

## Troubleshooting

- If you can't connect from your phone:
  - Verify both devices are on the same network
  - Check if your computer's firewall allows connections on ports 8000 and 5173
  - Try accessing the backend health check endpoint directly
  - Ensure you're using the correct IP address

- If you get API errors:
  - Verify your OpenAI API key is correct
  - Check if you have sufficient API credits
  - Ensure your API key has access to GPT-4 Vision