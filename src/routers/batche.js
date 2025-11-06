const express = require("express");
const fs = require('fs');
const path = require('path');

const validator = require("validator");
const router = new express.Router();

const Institution = require("../models/institutes");
const Batche = require("../models/batches");
const Test = require("../models/tests");
const Student = require("../models/students");
const Teacher = require("../models/teachers");
const TestResult = require("../models/testResults");


// {
//     "batchName": "batch1",
//     "syllabus": "hello boy",
//         "list": [
//             {
//                 "id": "65f73f066f7aabeaea2faaa8",
//                 "name": "String",
//                 "profileImage": "String",
//                 "attendence": "String",
//                 "month": "String",
//                 "totalAttendence": "String",
//                 "fees": "String",
//                 "lastAttendence": [
//                     {
//                         "month": "String",
//                         "attendence":"String"
//                     },
//                     {
//                         "month": "String",
//                         "attendence":"String"
//                     }
//                 ]
//             }
//         ]
// }

//This api will register a new batch
router.post("/batches/addBatch", basicAuth, async (req, res) => {
    try {
        const { batchName, syllabus, institutionCode, userId } = req.body;

        // Check if batch with the same name already exists
        const existingBatch = await Batche.findOne({ batchName });

        if (existingBatch) {
            return res.status(200).json({
                statusCode: 200,
                message: 'Batch already exists. Please enter a new batch name.'
            });
        }

        // Create a new batch
        let newBatch = new Batche({ batchName, syllabus });
        newBatch.institutionCode = institutionCode;
        const createdBatch = await newBatch.save();
        // Create a new Test batch
        const batchId = createdBatch.id;
        const newTestBatch = new Test({ batchName, batchId });
        await newTestBatch.save();
        const newTestResultBatch = new TestResult({ batchId, batchName });
        await newTestResultBatch.save();
        let instiData = await Institution.findById(userId);
        instiData.batchList.push({
            id: createdBatch.id
        });
        await instiData.save();

        res.json({
            statusCode: 200,
            message: 'Batch Added'
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

//This api will assign teacher in Batch
router.post("/batches/assignteacher", basicAuth, async (req, res) => {
    try {
        const { batchId, teacherId } = req.body;
        let teacherData = await Teacher.findById(teacherId);
        if (!teacherData) {
            return res.status(200).json({
                statusCode: 201,
                message: 'Teacher Not Found!'
            });
        }
        teacherData.batchList.push({
            id: batchId,
        });
        await teacherData.save();
        res.json({
            statusCode: 200,
            message: 'Teacher Added in Batch'
        });
    } catch (e) {
        return res.json({
            statusCode: 201,
            message: 'Server Error!'
        });
    }
});

//This api will fetch registered teachers in institute
router.post("/batches/fetchteachers", basicAuth, async (req, res) => {
    try {
        const { userId, batchId } = req.body;
        const instiData = await Institution.findById(userId);
        let teachersList = [];

        for (let data of instiData.teachersList) {
            let teacherFounnd = false;
            let teacherData = await Teacher.findById(data.id);
            for (let batchData of teacherData.batchList) {
                if (batchData.id == batchId) {
                    teacherFounnd = true;
                    break;
                }
            }
            if (teacherFounnd != true) {
                teachersList.push({
                    name: teacherData.name,
                    id: teacherData.id,
                    image: teacherData.profileImage
                });
            }
        }
        res.json({
            statusCode: 200,
            message: 'success',
            data: teachersList
        });
    } catch (e) {
        return res.json({
            statusCode: 201,
            message: 'Server Error!'
        });
    }
});
// ---------------------------------------------------------------------------------------


//This api will give all batches data
router.post("/batches/getAllBatches", basicAuth, async (req, res) => {

    try {
        const { institutionCode } = req.body;
        const batchesData = await Batche.find();
        let kaamKbatch = [];
        for (let batData of batchesData) {
            if (batData.institutionCode == institutionCode) {
                kaamKbatch.push({
                    id: batData.id,
                    name: batData.batchName,
                })
            }
        }
        res.json({
            statusCode: 200,
            message: 'Success',
            data: kaamKbatch

        });
    } catch (e) {
        res.send(e);
    }
});
// {
//     "needBatch":true
// }

//This api will give all batches data
router.post("/batches/teacher/getAllBatches", basicAuth, async (req, res) => {

    try {
        const batchesData = await Batche.find();

        res.json({
            statusCode: 200,
            message: 'Success',
            data: batchesData

        });
    } catch (e) {
        res.send(e);
    }
});


//This api will give all batches data // incomplete api and not attached in app
router.post("/batches/teacher/getBatches", basicAuth, async (req, res) => {

    try {
        const { id } = req.body;
        const teacher = await Teacher.findById(id);
        let kaamKbatch = [];
        for (let batData of teacher.batchList) {
            const batch = await Batche.findById(batData.id);
            kaamKbatch.push({
                id: batData.id,
                name: batch.batchName,
            });
        }
        res.json({
            statusCode: 200,
            message: 'Success',
            data: kaamKbatch

        });
    } catch (e) {
        res.send(e);
    }
});




// ---------------------------------------------------------------------------------------

// {
//     "uid":"USERID"
// }

//This api will give student Attendance
router.post("/batches/getAttendence", basicAuth, async (req, res) => {

    try {
        const { uid } = req.body;
        const studentData = await Student.findById(uid);
        let batchList = [];
        for (let data of studentData.batches) {
            const batchData = await Batche.findById(data.id);
            batchList.push({
                name: batchData.batchName,
                attendance: data.attendance
            });
        }
        res.json({
            statusCode: 200,
            message: 'Success',
            data: batchList

        });
    } catch (e) {
        res.json({
            statusCode: 201,
            message: 'You are not in any batch'

        });
    }
});
// ---------------------------------------------------------------------------------------


// {
//     "id":"65f867489fe537edbe4a962c",
//     "list": [
//             {
//                 "id": "65f73f066f7aabeaea2faaa8",
//                 "name": "Yash",
//                 "profileImage": "String",
//                 "attendence": "String",
//                 "month": "String",
//                 "totalAttendence": "String",
//                 "fees": "String",
//                 "lastAttendence": [
//                     {
//                         "month": "String",
//                         "attendence":"String"
//                     },
//                     {
//                         "month": "String",
//                         "attendence":"String"
//                     }
//                 ]
//             }
//             ]
// }


// //  This api will add student in batches

// router.post("/batches/addStudent", basicAuth, async (req, res) => {
//     try {
//         const { id, list } = req.body;
//         if (!id || !list || !Array.isArray(list)) {
//             return res.status(400).json({ error: 'Error: ID and list array are required' });
//         }
//         const batch = await Batche.findById(id);
//         if (!batch) {
//             return res.status(404).json({
//                 statusCode: 404,
//                 message: 'Batch not found'
//             });
//         }
//         batch.list.push(...list);
//         const _id = req.body.list[0].id;
//         const updateStudents = await Student.findByIdAndUpdate(_id, { $addToSet: { batches: id } });
//         const updatedBatch = await batch.save();
//         res.status(200).json({
//             statusCode: 200,
//             message: 'Students Added Successfully'
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

//  This api will add student in batches

router.post("/batches/addStudent", basicAuth, async (req, res) => {
    try {
        const { userId, batchId } = req.body;
        let user = await Student.findById(userId);
        user.batches.push({ id: batchId });
        await user.save();
        res.status(200).json({
            statusCode: 200,
            message: 'Students Added Successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  This api will mark attendence of studet in batch according to date

router.post("/batches/markAttendance", basicAuth, async (req, res) => {
    try {
        const { userId, batchId, date, status } = req.body;
        let user = await Student.findById(userId);
        for (let data of user.batches) {
            if (data.id == batchId) {
                data.attendance.push({
                    date: date,
                    status: status
                })
            }
            await user.save();
        }
        res.status(200).json({
            statusCode: 200,
            message: 'Attendance Marked!'
        });
    } catch (error) {
        res.status(200).json({
            statusCode: 201,
            message: 'Server Error'
        });
    }
});

//  This api will give give data of students who are in batch with there attendence.
router.post("/batches/getAttendance", basicAuth, async (req, res) => {
    try {
        const { date, batchId } = req.body;
        const batchData = await Batche.findById(batchId);
        let users = await Student.find();
        let studentData = [];
        let attend = {};
        for (let data of users) {
            let isDate = false;
            if (data.institutionCode == batchData.institutionCode) {
                for (let userBatch of data.batches) {
                    if (userBatch.id == batchId) {
                        try {
                            for (let atten of userBatch.attendance) {
                                if (atten.date == date) {
                                    isDate = true;
                                    attend = {
                                        date: atten.date,
                                        status: atten.status
                                    };
                                }
                            }
                        } catch (e) {
                        }
                        if (isDate == true) {
                            studentData.push({
                                id: data.id,
                                name: data.name,
                                image: data.profileImage,
                                attendance: attend
                            });
                        } else {
                            studentData.push({
                                id: data.id,
                                name: data.name,
                                image: data.profileImage,
                                attendance: {}
                            });
                        }

                    }
                }
            }
        }
        res.status(200).json({
            statusCode: 200,
            message: 'Success',
            data: studentData
        });
    } catch (error) {
        // res.status(500).json({ error: error.message });
        res.status(200).json({
            statusCode: 201,
            message: 'Server Error'
        });
    }
});


// ---------------------------------------------------------------------------------------


// {
//     "id": "65f8671c9fe537edbe4a9627"
// }

//This api will give the list of students which Are not in given batch id
router.post("/batches/getBatchStudents", basicAuth, async (req, res) => {
    try {
        const { id } = req.body;
        const batchData = await Batche.findById(id);
        const users = await Student.find();
        let studentList = [];

        for (let data of users) {
            if (data.institutionCode == batchData.institutionCode) {
                let isBatchFound = false;
                for (let batchList of data.batches) {
                    if (batchList.id == id) {
                        isBatchFound = true;
                        break;
                    }
                }
                if (isBatchFound != true) {
                    studentList.push({
                        id: data.id,
                        name: data.name,
                        image: data.profileImage
                    });
                }
            }
        }
        res.json({
            statusCode: 200,
            message: 'Success',
            students: studentList
        });
    } catch (e) {
        res.json({
            statusCode: 201,
            message: 'Server error!',
        });
    }
});


// {
//     "id":"6606f3e549bc7dd65fb12c2f",
//     "syllabus":"OK"
// }
//This api will update Syllabus in batche
router.post("/batches//", basicAuth, async (req, res) => {
    try {
        const batchId = req.body.id;
        const SyllabusOfBatch = req.body.syllabus;
        let batchData = await Batche.findById(batchId);

        batchData.syllabus = SyllabusOfBatch;
        await batchData.save();
        res.json({
            statusCode: 200,
            message: 'Success',
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

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
