require('dotenv').config();
const express = require('express');
const cors = require('cors');
const anonymousAuth = require('./auth/anonymous');
const refreshToken = require('./auth/refresh');
const secureKeys = require('./secure/keys');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

// Auth endpoints
app.post('/api/auth/anonymous', anonymousAuth);
app.post('/api/auth/refresh', refreshToken);
app.get('/api/secure/keys', secureKeys);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 