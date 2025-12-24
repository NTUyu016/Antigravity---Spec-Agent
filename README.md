# Antigravity---Spec-Agent

A "Spec Kit Agent" that wraps [GitHub Spec Kit](https://github.com/github/spec-kit) to allow users to generate specifications and prompts from natural language requirements.

## Features

- **Input Requirements**: Describe your feature or application in natural language.
- **Generate Spec**: Generates a `spec.md` structure based on `spec-kit` templates.
- **Get Spec Prompt**: Provides the exact prompt used, so you can copy-paste it into other AI tools (Claude, Copilot, etc.) if you prefer.
- **Auto-Generation**: If you provide an OpenAI API Key, the agent can generate the content for you directly.

## Prerequisites

- Python 3.8+
- Node.js 18+
- (Optional) `uv` for fast Python package management.

## Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/Antigravity---Spec-Agent.git
    cd Antigravity---Spec-Agent
    ```

2.  **Initialize Submodules**:
    Since this project uses `spec-kit` as a dependency in `vendor/`, ensure you have the files:
    ```bash
    # If you cloned recursively, you are good. Otherwise:
    git submodule update --init --recursive
    # Or if manually cloned:
    # git clone https://github.com/github/spec-kit.git vendor/spec-kit
    ```

3.  **Backend Setup**:

    You can use standard `venv` or `uv`.

    **Option A: Using `uv` (Recommended)**
    ```bash
    cd backend
    uv venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    uv pip install -r requirements.txt
    ```

    **Option B: Using standard `venv`**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate   # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```

4.  **Frontend**:
    ```bash
    cd frontend
    npm install
    ```

## Usage

You can start the application using the provided helper script:

```bash
# Ensure your virtual environment is activated if you created one manually
# source backend/.venv/bin/activate
./run.sh
```

Or run services manually:

1.  **Start Backend**:
    ```bash
    cd backend
    # Ensure venv is activated
    python main.py
    ```
    (Runs on http://localhost:8000)

2.  **Start Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```
    (Runs on http://localhost:5173)

## How it works

1.  The frontend accepts user requirements.
2.  The backend loads the `spec-template.md` from the vendorized `spec-kit` library.
3.  It constructs a prompt combining the template and the requirements.
4.  If an API key is provided, it calls OpenAI to fulfill the prompt. Otherwise, it returns the prompt and a placeholder message.
