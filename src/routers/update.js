const express = require("express");
const router = new express.Router();


router.post("/checkUpdate", basicAuth, async (req, res) => {
    try {
        const { version } = req.body;
        if (version == "1.0.23+29" || version == "1.0.24+30" || version == "1.0.24+31") {
            res.json({
                statusCode: 200,
                message: 'Success',

            });
        } else {
            res.json({
                statusCode: 210,
                message: 'Old Version',

            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

function basicAuth(req, res, next) {
    // Parse username and password from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).send('Unauthorized');
    }

    // Decode and extract credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Check if username and password are valid
    if (username === 'Q29hY2hpbmdBcHBEZXZlbG9wZWRCeVlhc2hNYW5naG5hbmk=' && password === 'VGhpc1NlY3VyaXR5SXNPbnRlc3RpbmdQaGFzZQ==') {
        // Authentication successful, proceed to next middleware
        next();
    } else {
        // Invalid credentials
        return res.status(401).send('Unauthorized');
    }
}
module.exports = router;