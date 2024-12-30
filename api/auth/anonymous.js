const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Export the handler with middleware
module.exports = async (req, res) => {
    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { extensionId, timestamp, version } = req.body;

        if (!extensionId || !timestamp || !version) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a unique session ID
        const sessionId = crypto
            .createHash('sha256')
            .update(`${extensionId}-${timestamp}-${version}`)
            .digest('hex');

        // Create JWT token
        const token = jwt.sign({
            sessionId,
            extensionId,
            version,
            type: 'anonymous'
        }, JWT_SECRET, {
            expiresIn: '24h'
        });

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
        );

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Anonymous auth error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}; 