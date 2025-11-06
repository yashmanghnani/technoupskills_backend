const express = require("express");
const fs = require('fs');
const path = require('path');

const validator = require("validator");
const router = new express.Router();

const Institution = require("../models/institutes");

// This code will register user on server

router.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'uploads', filename);
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
});
router.post("/teacher/register", basicAuth, async (req, res) => {
    try {
        const { userId, data } = req.body;
        const Teacher = require("../models/teachers");
        let user = new Teacher();
        const base64Image = data.profileImage;
        if (base64Image != "0") {
            const imageBuffer = Buffer.from(base64Image, 'base64');
            const uploadDir = path.join(__dirname, 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            const filename = `${Date.now()}-profile.png`;
            const imagePath = path.join(uploadDir, filename);
            fs.writeFile(imagePath, imageBuffer, async (err) => {
                if (err) {
                    console.error('Error saving image:', err);
                    return res.status(500).send('Error saving image');
                }
                const imageUrl = `/uploads/${filename}`;
                user.profileImage = imageUrl;
                user.name = data.name;
                user.email = data.email;
                user.password = data.password;
                user.phone = data.phone;
                try {
                     const createTeacher = await user.save();
                let instiData = await Institution.findById(userId);
                instiData.teachersList.push({
                    id: createTeacher.id
                });
                await instiData.save();
                res.status(200).json({
                    statusCode: 200,
                    message: 'Account Created',
                });
                } catch (e) {
                    res.status(200).json({
                statusCode: 201,
                message: 'These details are already in use',
            });
                }
               
            });
        } 
    } catch (e) {
        res.status(200).json({
                statusCode: 201,
                message: 'These details are already in use',
            });
    }
})



// This code will login user on server and give his userid

router.post("/institution/login", basicAuth, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Both email and password are required' });
        }
        const user = await Institution.findOne({ email });
        if (!user) {
            return res.status(202).json({
                statusCode: 202,
                message: 'User not found'
            });
        }
        if (user.password == password) {
            const userId = user._id;
            res.json({
                statusCode: 200,
                message: 'Success',
                data: { userId, }

            });
        } else {
            return res.status(202).json({
                statusCode: 202,
                message: 'Password mismatch'
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//This code will get user details from server to store in app locally
router.post("/institution/profile", basicAuth, async (req, res) => {
    try {
        const { id, version } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Error Id is required' });
        }
        if (version == "1.0.23+29" || version == "1.0.24+30" || version == "1.0.24+31") {
            const institutionData = await Institution.findById(id);
            if (!institutionData) {
                return res.status(202).json({
                    statusCode: 202,
                    message: 'User not found'
                });
            } else {
                res.json({
                    statusCode: 200,
                    message: 'Success',
                    data: institutionData

                });
            }
        } else {
            res.json({
                statusCode: 201,
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