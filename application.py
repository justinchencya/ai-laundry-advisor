from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import openai
import os
from dotenv import load_dotenv
import base64
import datetime

# Load environment variables
load_dotenv()

# Create the FastAPI application instance
application = app = FastAPI(
    title="AI Laundry Advisor",
    description="API for analyzing laundry care labels using AI",
    version="1.0.0"
)

# Configure CORS - allow all origins
origins = ["*"]

application.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

client = openai.OpenAI(api_key=api_key)

INVALID_IMAGE_MESSAGE = "Sorry, no valid laundry care symbols are identified."

@application.get("/")
async def root():
    """Root endpoint to verify the API is running."""
    return {
        "status": "online",
        "message": "Welcome to AI Laundry Advisor API",
        "endpoints": {
            "health": "/health",
            "analyze": "/analyze-label"
        }
    }

@application.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.datetime.now().isoformat()
    }

@application.post("/analyze-label")
async def analyze_label(file: UploadFile):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {file.content_type}. Please upload an image file."
            )

        # Read the image file
        try:
            contents = await file.read()
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error reading file: {str(e)}"
            )

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="Empty file uploaded"
            )

        base64_image = base64.b64encode(contents).decode('utf-8')

        # First, validate if the image contains laundry care labels
        try:
            validation_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an image validator for laundry care labels. Your task is to determine if the image contains valid laundry care symbols/labels. Respond with only 'valid' or 'invalid'."
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Is this a valid image of laundry care labels?"
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=50
            )

            validation_result = validation_response.choices[0].message.content.lower()
            
            if not validation_result.startswith('valid'):
                return JSONResponse(content={
                    "valid": False,
                    "message": INVALID_IMAGE_MESSAGE
                })

            # If valid, proceed with the analysis
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": """You are a laundry care advisor. Be extremely concise and clear. For each section, provide only the most important information in a single bullet point.

Format your response using these exact headers, with one bullet point per section:

## Water Temperature
• [Single most appropriate temperature]

## Washing Method
• [One key washing instruction]

## Drying
• [One key drying instruction]

## Ironing
• [One key ironing instruction]

## Special Care
• [One key special instruction, if needed]"""
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "What are the essential care instructions for this garment?"
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=200
            )

            return JSONResponse(content={
                "valid": True,
                "analysis": response.choices[0].message.content
            })

        except openai.APIError as e:
            raise HTTPException(
                status_code=500,
                detail=f"OpenAI API error: {str(e)}"
            )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )

# Add this for Heroku deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("application:application", host="0.0.0.0", port=port) 