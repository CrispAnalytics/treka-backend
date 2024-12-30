# Treka Backend

Backend service for the Treka Chrome extension.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### POST /api/auth/anonymous
Create an anonymous session for the extension.

### POST /api/auth/refresh
Refresh an existing authentication token.

### GET /api/secure/keys
Get secure API keys (requires authentication). 