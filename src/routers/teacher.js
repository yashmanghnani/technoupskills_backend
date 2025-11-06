const express = require("express");

const validator = require("validator");
const router = new express.Router();

const Teacher = require("../models/teachers");

router.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'uploads', filename);

    // Check if the file exists
    if (fs.existsSync(imagePath)) {
        // Send the file as a response
        res.sendFile(imagePath);
    } else {
        // If the file does not exist, return a 404 error
        res.status(404).send('Image not found');
    }
});


// this code will login teacher from database
router.post("/teachers/login", basicAuth, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Both email and password are required' });
        }
        const user = await Teacher.findOne({ email });
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
})


//This code will get teacher details from server to store in app locally

router.post("/teachers/profile", basicAuth, async (req, res) => {
    try {
        const { id, version } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Error Id is required' });
        }
        if (version == "1.0.23+29" || version == "1.0.24+30" || version == "1.0.24+31") {
            const teacherData = await Teacher.findById(id);
            if (!teacherData) {
                return res.status(202).json({
                    statusCode: 202,
                    message: 'User not found'
                });
            } else {
                res.json({
                    statusCode: 200,
                    message: 'Success',
                    data: teacherData

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



//This code will change password

router.post("/teachers/profile/changePassword", basicAuth, async (req, res) => {

    try {
        try {
            const _id = req.body.id;
            const oldPassword = req.body.oldPassword;
            const newPassword = req.body.newPassword;
            const existingTeacher = await Teacher.findById(_id);

            if (!existingTeacher) {
                return res.status(400).json({ message: "User not found" });
            }
            if (oldPassword != existingTeacher.password) {
                return res.status(400).json({ message: "Old password doesn't match" });
            }
            const updateTeachers = await Teacher.findByIdAndUpdate(_id, { password: newPassword }, {
                new: true,
            });
            return res.status(400).json({ message: "Password Chnages Successfully" });
        } catch (e) {
            res.status(409).send(e);
        }

    } catch (e) {
        res.status(404).send("Error 404 data not found");
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