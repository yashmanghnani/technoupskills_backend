const express = require("express");

const router = new express.Router();
const Student = require("../models/students");
const Test = require("../models/tests");
const Batche = require("../models/batches");
// {
//     "_id":"65fc48b140e694a4a1ccee8e",
//      "list":[
//          {
//              "title":"Hello this is Title",
//              "discription":"Hello this is Discription",
//              "questions":"10",
//              "time":"30 min",
//              "date":"21/03/2024",
//              "isVisible":[],
//              "questionsList":[
//                  {
//                      "question":"This is Question",
//                      "optionA":"OptionA",
//                      "optionB":"OptionB",
//                      "optionC":"OptionC",
//                      "optionD":"OptionD",
//                      "correctAnswer":"correctAnswer"
//                  }
//              ]
//          }
//      ]
//  }

// This api will add new test.

router.post("/test/addNewTest", basicAuth, async (req, res) => {
    try {
        const { _id, list } = req.body;

        let testData = await Test.findById(_id);
        testData.list.push(...list);
        await testData.save();

        res.status(200).json({
            statusCode: 200,
            message: 'New test added successfully',
        });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});



// ---------------------------------------------------------------------------------------

// {
//     "_id":"65fc48b140e694a4a1ccee8e",
//     "testId":"65fc613795ca81a184803edb",
//     "userId" :"65f73f066f7aabeaea2faaa8"
// }

// This api will update test status for user, that user started the test.

router.post("/test/addUserVisibility", basicAuth, async (req, res) => {
    try {
        const { _id, testId, userId } = req.body;

        let testData = await Test.find({ batchId: _id });
        for (let i = 0; i < testData[0].list.length; i++) {
            if (testData[0].list[i]._id.toString() === testId) {
                testData[0].list[i].isVisible.push({ id: userId, isVisible: true });
                break;
            }
        }
        await testData[0].save();
        res.status(200).json({
            statusCode: 200,
            message: 'Test Started',
        });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});


// ---------------------------------------------------------------------------------------

// {
//     "_id":"65fc48b140e694a4a1ccee8e",
//     "testId":"65fc613795ca81a184803edb",
//     "userId" :"65f73f066f7aabeaea2faaa8"
// }

// This api will check test status for user, that user started the test.

router.post("/test/checkTestStarted", basicAuth, async (req, res) => {
    try {
        const { _id, testId, userId } = req.body;

        let testData = await Test.findById(_id);
        let testStarted = false;

        for (let i = 0; i < testData.list.length; i++) {
            if (testData.list[i]._id.toString() === testId) {
                for (let j = 0; j < testData.list[i].isVisible.length; j++) {
                    if (testData.list[i].isVisible[j].id == userId) {
                        testStarted = true;
                        break;
                    }
                }
                break; // Exit the loop once the test is found
            }
        }

        if (testStarted) {
            res.status(200).json({
                statusCode: 200,
                message: 'Success',
                result: true,
                // This means user started the test already 
            });
        } else {
            res.status(200).json({
                statusCode: 200,
                message: 'Success',
                result: false,
                // This means user didnt started the test 
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

// ---------------------------------------------------------------------------------------

// {
//     "needBatch":true
// }

//This api will give all batches data
router.post("/test/getAllTestBatches", basicAuth, async (req, res) => {

    try {

        const batchesData = await Test.find();

        res.json({
            statusCode: 200,
            message: 'Success',
            data: batchesData

        });
    } catch (e) {
        res.send(e);
    }
});


// {
//     "uid":"uid"
// }

//This api will give all batches along with there test data.
router.post("/test/getStudentTests", basicAuth, async (req, res) => {

    try {
        const { uid } = req.body;
        const studentData = await Student.findById(uid);
        const batches = studentData.batches;
        let batchList = [];
        for (let i = 0; i < batches.length; i++) {
            const batchId = await Batche.findById(batches[i].id);
            const batchesData = await Test.find({ batchId: batches[i].id });
            let testData = [];
            batchList.push({
                name: batchId.batchName,
                batchId: batches[i].id,
                data: batchesData[0].list
            });
        }
        res.json({
            statusCode: 200,
            message: 'Success',
            data: batchList

        });
    } catch (e) {
        res.send(e);
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
