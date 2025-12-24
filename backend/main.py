from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os
import openai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    requirements: str
    api_key: Optional[str] = None

class GenerateResponse(BaseModel):
    spec: str
    prompt: str

SPEC_TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "../vendor/spec-kit/templates/spec-template.md")

def get_spec_template():
    try:
        with open(SPEC_TEMPLATE_PATH, "r") as f:
            return f.read()
    except FileNotFoundError:
        return "Error: spec-template.md not found."

@app.post("/api/generate", response_model=GenerateResponse)
async def generate_spec(request: GenerateRequest):
    template = get_spec_template()

    # Construct the prompt
    prompt = f"""You are a Spec-Driven Development expert.
Your goal is to generate a functional specification based on the user's requirements and the provided template.

TEMPLATE:
{template}

USER REQUIREMENTS:
{request.requirements}

INSTRUCTIONS:
Please generate the content of the `spec.md` file following the structure in the TEMPLATE.
Do not include the prompt itself in the output, just the specification markdown content.
"""

    generated_spec = ""

    if request.api_key:
        try:
            client = openai.OpenAI(api_key=request.api_key)
            response = client.chat.completions.create(
                model="gpt-4o", # Or gpt-3.5-turbo
                messages=[
                    {"role": "system", "content": "You are a helpful software architect."},
                    {"role": "user", "content": prompt}
                ]
            )
            generated_spec = response.choices[0].message.content
        except Exception as e:
            generated_spec = f"Error calling OpenAI API: {str(e)}"
    else:
        generated_spec = "API Key not provided. Please provide an API key to generate the spec, or use the prompt below with your own LLM."

    return GenerateResponse(
        spec=generated_spec,
        prompt=prompt
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
