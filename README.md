# HashTag Generator

A Flask-based API that generates hashtags using Google's Generative AI.

## Project Setup

### Prerequisites

- Python 3.7+
- Google Generative AI API key

### Installation

1. Clone the repository:

```
git clone <repository-url>
cd HashTagGenerator
```

2. Create a virtual environment:

```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory and add your Google API key:
```
GOOGLE_API_KEY=your_api_key_here
```

### Running Locally

```
flask run
```

## Deployment to Railway

1. Create a Railway account at [Railway.app](https://railway.app)

2. Install Railway CLI:
```
npm i -g @railway/cli
```

3. Login to Railway:
```
railway login
```

4. Initialize your project:
```
railway init
```

5. Add your environment variables in the Railway dashboard

6. Deploy your application:
```
railway up
```

7. Your application will be available at the URL provided by Railway

## API Documentation

(Add your API endpoints and usage instructions here)
