# Content-Pilot

A Flask-based API that generates hashtags, content, and thumbnails using Google's Generative AI.

## Live Demo

The application is live at: [https://content-pilot.onrender.com/](https://content-pilot.onrender.com/)

## Features and Functionality

### 1. Hashtag Generation

- Generate 30 relevant hashtags for any topic or image
- Interactive hashtag selection with click-to-select functionality
- Shows simulated post counts for each hashtag
- Copy selected or all hashtags with one click
- Real-time preview of selected hashtags

### 2. Content Generation

- Creates viral social media content for LinkedIn (default platform)
- Supports both text-based and image-based content generation
- Markdown support for formatting (bold, italic, bullet points)
- Optimized for engagement and reach
- Copy content with preserved formatting

### 3. Thumbnail Generation

- Generate thumbnail ideas for YouTube/blog content
- AI-powered image generation from text descriptions
- Download generated thumbnails in PNG format
- Fallback prompt-only mode if image generation fails
- Copy generated prompts for use with other tools

### 4. Additional Features

- Dark/Light theme toggle with system preference detection
- Image upload with preview
- Real-time chat-like interface
- Responsive design for all devices
- Error handling and user feedback
- Upload and process images for all generation modes
- Generate 30 relevant hashtags for any topic or image
- Interactive hashtag selection with click-to-select functionality
- Shows simulated post counts for each hashtag
- Copy selected or all hashtags with one click
- Real-time preview of selected hashtags

## Screenshots

### Main Interface

![Welcome Screen](frontend/static/images/screenshot1.png)

Shows the initial welcome message from the content assistant.

### Generated Content

![Hashtag Generation](frontend/static/images/screenshot2.png)

Displays generated hashtags with copy functionality and various social media related tags.

![Welcome Screen](frontend/static/images/screenshot1.png)

Shows the initial welcome message from the content assistant.

### Hashtag Generation

![Hashtag Generation](frontend/static/images/screenshot2.png)

Displays generated hashtags with copy functionality and various social media related tags.

![Welcome Screen](frontend/static/images/screenshot1.png)

Shows the initial welcome message from the content assistant.

### Hashtag Generation

![Hashtag Generation](frontend/static/images/screenshot2.png)

Displays generated hashtags with copy functionality and various social media related tags.

## Project Setup

### Prerequisites

- Python 3.7+
- Google Generative AI API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd HashTagGenerator
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory and add your Google API key:

```plaintext
GOOGLE_API_KEY=your_api_key_here
```

### Running Locally

```bash
flask run
```

### Deployment

The application is deployed on Render and is accessible at [https://content-pilot.onrender.com/](https://content-pilot.onrender.com/)

To deploy your own instance:

1. Create a Render account
2. Set up a new Web Service
3. Connect your GitHub repository
4. Add environment variables:
   - `GOOGLE_API_KEY`: Your Google Generative AI API key
5. Deploy and access your application at the provided URL

## API Documentation

### Endpoints

1. `/generate_hashtags` (POST)
   - Generate hashtags from text or image
   - Accepts: 
     - `topic` (text)
     - `image` (file)
   - Returns: JSON with hashtags array

2. `/generate_content` (POST)
   - Generate social media content
   - Accepts:
     - `topic` (text)
     - `image` (optional file)
     - `platform` (default: "linkedin")
   - Returns: JSON with generated content

3. `/generate_thumbnail` (POST)
   - Generate thumbnail ideas/images
   - Accepts:
     - `topic` (text)
   - Returns: JSON with prompt and optional image data
