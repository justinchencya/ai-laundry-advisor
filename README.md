# AI Laundry Advisor

AI Laundry Advisor is a tool that helps you understand the washing label on your clothes and find the most appropriate way for cleaning them.

## Features
- Take a photo or upload an image of a laundry care label
- Get instant analysis using OpenAI's Vision API
- Receive clear, concise washing instructions
- Mobile-friendly interface

## Tech Stack
- Backend: FastAPI (Python)
- Frontend: React + TypeScript + Vite
- AI: OpenAI GPT-4 Vision API
- Deployment: Heroku (Backend) + Vercel (Frontend)

## Prerequisites
- Python 3.7+
- Node.js and npm
- OpenAI API key
- Git
- Heroku CLI
- Vercel CLI (optional)

## Local Development Setup

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/justinchencya/ai-laundry-advisor.git
cd ai-laundry-advisor
```

2. Create and activate a Python virtual environment:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. Install backend dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
- Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_api_key_here
```

5. Run the backend server:
```bash
uvicorn application:application --reload
```
- Binds to 127.0.0.1 (localhost) by default
- Uses port 8000 by default
- Only accessible from your computer with `VITE_BACKEND_URL=http://localhost:8000` in `frontend/.env.local`
```bash
uvicorn application:application --host 0.0.0.0 --port 8000 --reload
```
- --host 0.0.0.0: Binds to all network interfaces
- --port 8000: Explicitly sets port (same as default)
- Accessible from your computer with `VITE_BACKEND_URL=http://localhost:8000` in `frontend/.env.local`
- Also accessible from other devices on your network with `VITE_BACKEND_URL=http://your.ip.address:8000` in `frontend/.env.local`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Set up environment variables:

- For desktop-only testing:
   - Create `.env.local`:
   ```
   VITE_BACKEND_URL=http://localhost:8000
   ```

- For multi-device testing:
   - Find your computer's IP address:
   ```bash
   # On macOS:
   ipconfig getifaddr en0
   
   # On Linux:
   ip addr show
   
   # On Windows:
   ipconfig
   # Look for IPv4 Address under your active network adapter
   ```

   - Create `.env.local` with your IP:
   ```
   VITE_BACKEND_URL=http://your.ip.address:8000
   ```

4. Start the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173` and `http://your.ip.address:5173/`

### Testing on Mobile Devices

1. Ensure both your computer and mobile device are on the same network

2. Start the backend server with the host flags as shown above

3. On your mobile device:
   - Open your browser
   - Navigate to `http://your.ip.address:5173`
   - Allow camera access if you want to use the camera feature

Note: If you can't connect from your mobile device:
- Check your computer's firewall settings
- Verify both devices are on the same network
- Try accessing the backend health check endpoint directly
- Double-check the IP address

## Production Deployment

### Backend Deployment (Heroku)

1. Install Heroku CLI and login:
```bash
# Install Heroku CLI (if not already installed)
# On macOS:
brew install heroku
# On Windows:
# Download installer from Heroku website

# Login to Heroku
heroku login
```

2. Create a new Heroku app:
```bash
heroku create your-app-name
```

3. Set up environment variables on Heroku:
```bash
heroku config:set OPENAI_API_KEY=your_api_key_here
```

4. Deploy to Heroku:
```bash
git push heroku main
```

Your backend API will be available at `https://your-app-name.herokuapp.com`

### Frontend Deployment (Vercel)

You can deploy to Vercel either through their web interface or using the CLI:

#### Option 1: Web Interface Deployment

1. Push your code to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Set up Vercel deployment:
   - Go to [Vercel](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "Import Project"
   - Select your repository
   - Configure project:
     - Framework Preset: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. Set up environment variables in Vercel:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `VITE_BACKEND_URL` with your Heroku backend URL:
     ```
     VITE_BACKEND_URL=https://your-heroku-app-name.herokuapp.com
     ```

4. Deploy:
   - Vercel will automatically deploy your frontend
   - Future deployments will happen automatically when you push to your main branch

Your frontend will be available at `https://your-project-name.vercel.app`

#### Option 2: CLI Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Navigate to your frontend directory:
```bash
cd frontend
```

4. Deploy to Vercel:
```bash
# For first-time deployment:
vercel

# For subsequent deployments:
vercel --prod
```

During the first deployment, you'll be asked several questions:
- Set up and deploy? `y`
- Which scope? Select your account
- Link to existing project? `N`
- What's your project name? `ai-laundry-advisor-frontend`
- In which directory is your code located? `./` (current directory)
- Want to modify these settings? `N`

5. Set up environment variables:
```bash
# Set production environment variable
vercel env add VITE_BACKEND_URL production
# Enter your Heroku backend URL when prompted

# If you want to set development environment variable
vercel env add VITE_BACKEND_URL development
# Enter http://localhost:8000 when prompted
```

6. For subsequent deployments, you can either:
   - Push to your connected GitHub repository
   - Run `vercel --prod` from the frontend directory

Note: The CLI deployment will automatically:
- Build your project
- Upload the dist directory
- Provide you with deployment URLs
- Handle environment variables

## Updating Your Application

### Backend Updates
```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main        # Update GitHub repository
git push heroku main       # Deploy to Heroku
```

### Frontend Updates
```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main        # This will automatically trigger Vercel deployment
```

## File Structure
```
ai-laundry-advisor/
├── application.py          # FastAPI backend application
├── requirements.txt        # Python dependencies
├── Procfile               # Heroku deployment configuration
├── .env                   # Backend environment variables (not in git)
└── frontend/
    ├── src/               # React frontend source code
    ├── public/            # Static assets
    ├── package.json       # Node.js dependencies
    ├── vite.config.ts     # Vite configuration
    ├── vercel.json        # Vercel deployment configuration
    └── .env.local         # Frontend environment variables (not in git)
```

## Environment Files

### Backend (.env)
```
OPENAI_API_KEY=your_api_key_here
```

### Frontend (.env.local for development)
```
VITE_BACKEND_URL=http://localhost:8000

# or, see above for multi-device testing
VITE_BACKEND_URL=http://your.ip.address:8000
```

## Troubleshooting

### Backend Issues
- If Heroku deployment fails:
  - Check Heroku logs: `heroku logs --tail`
  - Verify environment variables: `heroku config`
  - Ensure Procfile is correct
  - Check Python version in `runtime.txt`

### Frontend Issues
- If Vercel deployment fails:
  - Check build logs in Vercel dashboard
  - Verify environment variables
  - Ensure all dependencies are installed
  - Check build output directory

### Local Development Issues
- Backend won't start:
  - Check virtual environment is activated
  - Verify all dependencies are installed
  - Ensure OpenAI API key is set
- Frontend won't start:
  - Check Node.js version
  - Clear npm cache: `npm cache clean --force`
  - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a pull request