from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import openai
import os
from dotenv import load_dotenv
import base64

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

client = openai.OpenAI(api_key=api_key)

@app.post("/analyze-label")
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

        # Call OpenAI Vision API
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a laundry assistant responsible for advising on how to clean clothes properly. You always keep your answers simple and easy to understand."
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "According to these washing symbols, how should I clean this clothes? Please include: water temperature, washing method, drying instructions, ironing recommendations, and any special care instructions."
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
                max_tokens=300
            )

            if not response.choices or not response.choices[0].message.content:
                raise HTTPException(
                    status_code=500,
                    detail="No response received from OpenAI API"
                )

            return JSONResponse(content={
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

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 