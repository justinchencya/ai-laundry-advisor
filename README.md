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

4. Set up environment variables:

Backend:
- Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_api_key_here
```

Frontend:
- The project uses two environment files:

1. `frontend/.env` (committed to git):
```
VITE_BACKEND_URL=http://localhost:8000
```
This is the default configuration for local development.

2. `frontend/.env.local` (not committed to git):
```
VITE_BACKEND_URL=http://your.ip.address:8000
```
Create this file for mobile testing, replacing `your.ip.address` with your computer's IP address.

## Running the App

### Desktop Usage
No additional configuration needed - the default environment settings will work.

### Mobile Access (Phone)

1. Find your computer's local IP address:
   - On Mac/Linux: `ipconfig getifaddr en0` or `ip addr show`
   - On Windows: `ipconfig` and look for IPv4 Address

2. Create `frontend/.env.local` with your IP:
```
VITE_BACKEND_URL=http://your.ip.address:8000
```

3. Start the backend server with host access:
```bash
uvicorn application:app --host 0.0.0.0 --port 8000 --reload
```

4. Start the frontend server with host access:
```bash
cd frontend
npm run dev -- --host
```

5. On your phone:
   - Open your browser
   - Navigate to `http://your.ip.address:5173`
      - Port 5173 is the default port for Vite's development server.
      - Confirm on the actual port number in the terminal output of the frontend server.
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

## Environment Files

The project uses different environment files for configuration:

- `.env`: Backend environment variables (OpenAI API key)
- `frontend/.env`: Default frontend configuration (local development)
- `frontend/.env.local`: Local overrides for frontend (mobile testing)

Note: All `.env` files are excluded from git for security. Make sure to:
1. Never commit environment files
2. Keep your API keys secure
3. Create appropriate `.env` files when setting up the project

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.