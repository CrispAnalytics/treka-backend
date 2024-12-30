const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const handler = (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        // Create new token with refreshed expiry
        const newToken = jwt.sign({
            sessionId: decoded.sessionId,
            extensionId: decoded.extensionId,
            version: decoded.version,
            type: decoded.type
        }, JWT_SECRET, {
            expiresIn: '24h'
        });

        return res.status(200).json({ token: newToken });
    } catch (error) {
        console.error('Token refresh error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = handler; 