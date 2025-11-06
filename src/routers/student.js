const express = require("express");
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const validator = require("validator");
const router = new express.Router();

const Student = require("../models/students");

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
router.post("/students/register", basicAuth, async (req, res) => {
    try {
        const { name, email, password, phone, institutionCode, profileImage } = req.body;
        let user = new Student();
        const dateTime = new Date();
        user.name = name;
        user.email = email;
        user.password = password;
        user.phone = phone;
        user.institutionCode = institutionCode;
        user.absent = "0";
        user.registrationDate = dateTime.toString();
        user.present = "0";
        user.month = "0";
        user.profileImage = "";
        user.attendence = { "month": "january", "attendence": "0" };
        user.batches = [];
        try {
            await user.save();
            const imageBuffer = Buffer.from(profileImage, 'base64');
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
                user.profileImage = `/uploads/${filename}`;
                await user.save();
            });

            res.status(200).json({
                statusCode: 200,
                message: 'Account Created',
            });
        } catch (e) {
            try {
                if (e.keyPattern.email == 1) {
                    res.status(200).json({
                        statusCode: 201,
                        message: "Email is Already Registered",
                    });
                } else if (e.keyPattern.phone == 1) {
                    res.status(200).json({
                        statusCode: 201,
                        message: "Phone Number is Already Registered",
                    });
                }
                else {
                    return res.json({
                        statusCode: 201,
                        message: 'Server Error'
                    });
                }
            }
            catch (ee) {
                return res.json({
                    statusCode: 201,
                    message: 'Server Error'
                });
            }
        }
    } catch (e) {
        return res.json({
            statusCode: 201,
            message: 'Server Error'
        });
    }
})

//enable this when you need to get all users data from /localhost/students

router.post("/students", basicAuth, async (req, res) => {
    try {
        const studentsData = await Student.find();
        res.json({
            statusCode: 200,
            message: 'Success',
            data: studentsData

        });
    } catch (e) {
        res.send(e);
    }
})

// This code will login user on server and give his userid

router.post("/students/login", basicAuth, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Both email and password are required' });
        }
        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(200).json({
                statusCode: 201,
                message: 'Incorrect Email!'
            });
        }
        if (user.password == password) {
            if (user.isVerified == false || user.isVerified == null || user.otp == null) {
                const otp = Math.floor(1000 + Math.random() * 9000);
                const url = `https://technoupskills.com/api/sendOTPApi.php?otp=${otp}&email=${user.email}`;
                await axios.get(url)
                    .then(async response => {
                    })
                    .catch(error => {
                        return res.status(200).json({
                            statusCode: 201,
                            message: 'Otp Server Error!'
                        });
                    });
                user.otp = otp;
                user.isVerified = false;
                await user.save();
                res.json({
                    statusCode: 202,
                    message: 'Please verify your account!',
                    data: { userId: user.id, },

                });
            } else {
                res.json({
                    statusCode: 200,
                    message: 'Success',
                    data: { userId: user.id, },
                });
            }
        } else {
            return res.status(202).json({
                statusCode: 201,
                message: 'Password mismatch'
            });
        }
    } catch (error) {
        res.json({
            statusCode: 205,
            message: 'Server Error'
        });
    }
});

//This code will get user details from server to store in app locally

router.post("/students/verifyAccount", basicAuth, async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await Student.findById(userId);
        if (user.otp == otp) {
            user.isVerified = true;
            await user.save();
            res.json({
                statusCode: 200,
                message: 'Account Verified!'
            });
        } else {
            res.json({
                statusCode: 201,
                message: 'OTP mismatch'
            });
        }
    } catch (error) {
        res.json({
            statusCode: 205,
            message: 'Server Error'
        });
    }
})

//This code will get user details from server to store in app locally

router.post("/students/forgotPassword", basicAuth, async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Student.findOne({ "email": email });
        if (!user) {
            return res.json({
                statusCode: 201,
                message: 'User not found!'
            });
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        const url = `https://technoupskills.com/api/sendOTPApi.php?otp=${otp}&email=${user.email}`;
        await axios.get(url)
            .then(async response => {
            })
            .catch(error => {
                return res.status(200).json({
                    statusCode: 201,
                    message: 'Otp Server Error!'
                });
            });
        user.otp = otp;
        user.isVerified = false;
        user.save();
        res.json({
            statusCode: 200,
            message: 'Otp sended to your email!',
            data: {
                userId: user.id
            }
        });
    } catch (error) {
        res.json({
            statusCode: 205,
            message: 'Server Error'
        });
    }
})

//This code will get user details from server to store in app locally

router.post("/students/changePassword", basicAuth, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Student.findOne({ "email": email });
        if (!user) {
            return res.json({
                statusCode: 201,
                message: 'Incorrect Email!'
            });
        }
        user.password = password;
        user.save();
        res.json({
            statusCode: 200,
            message: 'Password changed, you can login now!'
        });
    } catch (error) {
        res.json({
            statusCode: 205,
            message: 'Server Error'
        });
    }
})
//This code will get user details from server to store in app locally

router.post("/students/resendOtp", basicAuth, async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await Student.findById(userId);
        const otp = Math.floor(1000 + Math.random() * 9000);
        const url = `https://technoupskills.com/api/sendOTPApi.php?otp=${otp}&email=${user.email}`;
        await axios.get(url)
            .then(async response => {
            })
            .catch(error => {
                return res.status(200).json({
                    statusCode: 201,
                    message: 'Otp Server Error!'
                });
            });
        user.otp = otp;
        await user.save();
        res.json({
            statusCode: 200,
            message: 'OTP Resended to your mail!'
        });
    } catch (error) {
        res.json({
            statusCode: 205,
            message: 'Server Error'
        });
    }
})
//This code will get user details from server to store in app locally

router.post("/students/profile", basicAuth, async (req, res) => {
    try {
        const { id, version } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Error Id is required' });
        }
        if (version == "1.0.23+29" || version == "1.0.24+30" || version == "1.0.24+31") {
            const studentData = await Student.findById(id);
            res.json({
                statusCode: 200,
                message: 'Success',
                data: studentData

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

//This code will change password

router.post("/students/profile/changePassword", basicAuth, async (req, res) => {

    try {
        try {
            const _id = req.body.id;
            const oldPassword = req.body.oldPassword;
            const newPassword = req.body.newPassword;
            const existingStudent = await Student.findById(_id);

            if (!existingStudent) {
                return res.status(400).json({ message: "User not found" });
            }

            // Check if the old password match
            if (oldPassword != existingStudent.password) {
                return res.status(400).json({ message: "Old password doesn't match" });
            }

            // Update the password
            const updateStudents = await Student.findByIdAndUpdate(_id, { password: newPassword }, {
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

//This code will get user details from server

// router.get("/students/:id",basicAuth, async (req, res) => {
//     try {
//         const _id = req.params.id;
//         const studentData = await Student.findById(_id);
//         if (!studentData) {
//             return res.status(404).send();
//         } else {
//             res.send(studentData);
//         }
//     } catch (e) {
//         res.status(404).send("Error 404 data not found");
//     }
// })


//This code will update user details on server

// router.patch("/students/:id",basicAuth, async (req, res) => {
//     try {

//         try {
//             const _id = req.params.id;
//             const updateStudents = await Student.findByIdAndUpdate(_id, req.body, {
//                 new: true,
//             });
//             res.send(updateStudents);
//         } catch (e) {
//             res.status(409).send(e);
//         }

//     } catch (e) {
//         res.status(404).send("Error 404 data not found");
//     }
// })

//This code will delete user details on server

// router.delete("/students/:id",basicAuth, async (req, res) => {
//     try {
//         const _id = req.params.id;
//         const deleteStudents = await Student.findByIdAndDelete(_id);
//         if (!deleteStudents) {
//             return res.status(404).send("Error 404 data not found");
//         }
//         else {
//             res.send(deleteStudents);
//         }
//     } catch (e) {
//         res.status(404).send("Error 404 data not found");
//     }
// })


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