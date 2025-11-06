const express = require("express");
const router = new express.Router();
const TestResult = require("../models/testResults");



// ---------------------------------------------------------------------------------------

// {
//     "batchId":"65fc48b140e694a4a1ccee8c",
//     "testList":[
//         {   
//             "testId":"65fddfb42f7e05c998f0b4fe",
//             "list":[
//                 {
//                     "userId":"65f73f066f7aabeaea2faaa8",
//                     "marks":"String",
//                     "grade":"String",
//                     "title":"String",
//                     "name":"String",
//                     "correct":"String",
//                     "skip":"String",
//                     "wrong":"String",
//                     "questions":[
//                             {
//                                 "question":"String",
//                                 "optionA":"String",
//                                 "optionB":"String",
//                                 "optionC":"String",
//                                 "optionD":"String",
//                                 "correctAnswer":"String",
//                                 "selected":"String"
//                             }
//                         ]
//                 }
//             ]
//         }
//     ]
// }




// This api will add testResult and update testResult on server.
// router.post("/testResult/updateTestData", async (req, res) => {
//     try {
//         let { batchId, testList } = req.body;

//         // Find the batch by its ID
//         let batch = await TestResult.findOne({ batchId });

//         if (!batch) {
//             // If batch doesn't exist, create a new one
//             batch = new TestResult({ batchId });
//         }

//         let testIdIndex = 0;
//         let studentIdIndex = 0;
//         if (batch.testList.length == 0) {
//             if (parseFloat(testList[0].list[0].marks) > 90) {
//                 testList[0].list[0].grade = "Grade A";
//                 testList[0].list[0].title = "You're Execellent";
//             } else if (parseFloat(testList[0].list[0].marks) > 80 && parseFloat(testList[0].list[0].marks) <= 90) {
//                 testList[0].list[0].grade = "Grade B";
//                 testList[0].list[0].title = "You're Good";
//             } else if (parseFloat(testList[0].list[0].marks) > 65 && parseFloat(testList[0].list[0].marks) <= 80) {
//                 testList[0].list[0].grade = "Grade C";
//                 testList[0].list[0].title = "You need improvement";
//             } else if (parseFloat(testList[0].list[0].marks) > 50 && parseFloat(testList[0].list[0].marks) <= 65) {
//                 testList[0].list[0].grade = "Grade D";
//                 testList[0].list[0].title = "You're have to work hard";
//             } else if (parseFloat(testList[0].list[0].marks) > 35 && parseFloat(testList[0].list[0].marks) <= 50) {
//                 testList[0].list[0].grade = "Grade E";
//                 testList[0].list[0].title = "You strongly need to work hard";
//             } else if (parseFloat(testList[0].list[0].marks) < 36) {
//                 testList[0].list[0].grade = "Grade F";
//                 testList[0].list[0].title = "You are Fail Call your parents";
//             }
//             batch.testList.push(testList[0]);
//         } else {

//             for (let i = 0; i < batch.testList.length; i++) {
//                 if (batch.testList[i].testId === testList[0].testId) {
//                     testIdIndex = i;
//                     break;
//                 } else if (i === batch.testList.length - 1) {
//                     batch.testList.push(testList[0]);

//                 }
//             }

//             for (let i = 0; i < batch.testList[testIdIndex].list.length; i++) {
//                 if (batch.testList[testIdIndex].list[i].userId === testList[0].list[0].userId) {
//                     studentIdIndex = i;
//                     break;
//                 } else if (i === batch.testList[testIdIndex].list.length - 1) {
//                     if (parseFloat(testList[0].list[0].marks) > 90) {
//                         testList[0].list[0].grade = "Grade A";
//                         testList[0].list[0].title = "You're Execellent";
//                     } else if (parseFloat(testList[0].list[0].marks) > 80 && parseFloat(testList[0].list[0].marks) <= 90) {
//                         testList[0].list[0].grade = "Grade B";
//                         testList[0].list[0].title = "You're Good";
//                     } else if (parseFloat(testList[0].list[0].marks) > 65 && parseFloat(testList[0].list[0].marks) <= 80) {
//                         testList[0].list[0].grade = "Grade C";
//                         testList[0].list[0].title = "You need improvement";
//                     } else if (parseFloat(testList[0].list[0].marks) > 50 && parseFloat(testList[0].list[0].marks) <= 65) {
//                         testList[0].list[0].grade = "Grade D";
//                         testList[0].list[0].title = "You're have to work hard";
//                     } else if (parseFloat(testList[0].list[0].marks) > 35 && parseFloat(testList[0].list[0].marks) <= 50) {
//                         testList[0].list[0].grade = "Grade E";
//                         testList[0].list[0].title = "You strongly need to work hard";
//                     } else if (parseFloat(testList[0].list[0].marks) < 36) {
//                         testList[0].list[0].grade = "Grade F";
//                         testList[0].list[0].title = "You are Fail Call your parents";
//                     }
//                     batch.testList[testIdIndex].list.push(testList[0].list[0]);
//                     break;
//                 }
//             }
//             var marks = parseFloat(testList[0].list[0].marks) + parseFloat(batch.testList[testIdIndex].list[studentIdIndex].marks);
//             testList[0].list[0].marks = marks.toString();

//             // Assign grade and title based on marks
//             if (marks > 90) {
//                 testList[0].list[0].grade = "Grade A";
//                 testList[0].list[0].title = "You're Excellent";
//             } else if (marks > 80) {
//                 testList[0].list[0].grade = "Grade B";
//                 testList[0].list[0].title = "You're Good";
//             } else if (marks > 65) {
//                 testList[0].list[0].grade = "Grade C";
//                 testList[0].list[0].title = "You need improvement";
//             } else if (marks > 50) {
//                 testList[0].list[0].grade = "Grade D";
//                 testList[0].list[0].title = "You have to work hard";
//             } else if (marks > 35) {
//                 testList[0].list[0].grade = "Grade E";
//                 testList[0].list[0].title = "You strongly need to work hard";
//             } else {
//                 testList[0].list[0].grade = "Grade F";
//                 testList[0].list[0].title = "You are Fail Call your parents";
//             }

//             // Update batch data
//             var studentData = batch.testList[testIdIndex].list[studentIdIndex];
//             studentData.marks = testList[0].list[0].marks;
//             studentData.grade = testList[0].list[0].grade;
//             studentData.title = testList[0].list[0].title;
//             studentData.correct = (parseFloat(testList[0].list[0].correct) + parseFloat(batch.testList[testIdIndex].list[studentIdIndex].correct)).toString();
//             studentData.skip = (parseFloat(testList[0].list[0].skip) + parseFloat(batch.testList[testIdIndex].list[studentIdIndex].skip)).toString();
//             studentData.wrong = (parseFloat(testList[0].list[0].wrong) + parseFloat(batch.testList[testIdIndex].list[studentIdIndex].wrong)).toString();

//             batch.testList[testIdIndex].list[studentIdIndex].questions.push(...testList[0].list[0].questions);
//         }

//         // Save the updated batch
//         await batch.save();

//         res.status(200).json({
//             statusCode: 200,
//             message: 'Test data updated successfully',
//         });
//     } catch (e) {
//         console.error(e);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.post("/testResult/updateTestData", basicAuth, async (req, res) => {
    try {
        let { batchId, testList } = req.body;
        let yash = false;

        // Find the batch by its ID
        let batch = await TestResult.findOne({ batchId });

        if (!batch) {
            // If batch doesn't exist, create a new one
            batch = new TestResult({ batchId });
        }

        let testIdIndex = 0;
        let studentIdIndex = 0;
        // calculateGradeAndTitle(testList[0].list[0]);
        if (batch.testList.length == 0) {
            // Calculate grade and title based on marks
            calculateGradeAndTitle(testList[0].list[0]);

            // Push the test data into the batch
            batch.testList.push(testList[0]);
        } else {
            // Find the appropriate index for test and student
            for (let i = 0; i < batch.testList.length; i++) {
                if (batch.testList[i].testId === testList[0].testId) {
                    testIdIndex = i;
                    break;
                } else if (i === batch.testList.length - 1) {
                    batch.testList.push(testList[0]);
                    yash = true;
                    break;

                }
            }

            for (let i = 0; i < batch.testList[testIdIndex].list.length; i++) {
                if (batch.testList[testIdIndex].list[i].userId === testList[0].list[0].userId) {
                    studentIdIndex = i;
                    break;
                }
                else if (i === batch.testList[testIdIndex].list.length - 1) {
                    // Calculate grade and title based on marks
                    // calculateGradeAndTitle(testList[0].list[0]);

                    // Push the student's test data into the batch
                    if (yash == false) {
                        batch.testList[testIdIndex].list.push(testList[0].list[0]);
                        yash = true;
                        break;
                    }

                }
            }

            // Update marks, grade, title, and other stats
            if (yash == false) {
                updateStudentData(batch, testIdIndex, studentIdIndex, testList);
            }
        }

        // Save the updated batch
        await batch.save();

        res.status(200).json({
            statusCode: 200,
            message: 'Test data updated successfully',
        });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

function calculateGradeAndTitle(data) {
    const marks = parseFloat(data.marks);
    if (marks > 90) {
        data.grade = "Grade A";
        data.title = "You're Excellent";
    } else if (marks > 80) {
        data.grade = "Grade B";
        data.title = "You're Good";
    } else if (marks > 65) {
        data.grade = "Grade C";
        data.title = "You need improvement";
    } else if (marks > 50) {
        data.grade = "Grade D";
        data.title = "You have to work hard";
    } else if (marks > 35) {
        data.grade = "Grade E";
        data.title = "You strongly need to work hard";
    } else {
        data.grade = "Grade F";
        data.title = "You are Fail Call your parents";
    }
}

function updateStudentData(batch, testIdIndex, studentIdIndex, testList) {
    const studentData = batch.testList[testIdIndex].list[studentIdIndex];
    const testData = testList[0].list[0];

    // Update marks, grade, title, and other stats
    studentData.marks = (parseFloat(studentData.marks) + parseFloat(testData.marks)).toString();
    testData.marks = studentData.marks;
    calculateGradeAndTitle(testData);
    studentData.grade = testData.grade;
    studentData.title = testData.title;
    studentData.correct = (parseFloat(studentData.correct) + parseFloat(testData.correct)).toString();
    studentData.skip = (parseFloat(studentData.skip) + parseFloat(testData.skip)).toString();
    studentData.wrong = (parseFloat(studentData.wrong) + parseFloat(testData.wrong)).toString();

    // Push new questions
    studentData.questions.push(...testData.questions);
}


// ---------------------------------------------------------------------------------------

// {
//     "needBatch":true
// }

//This api will give all testResult data
router.post("/testResult/getAllTestResultBatches", basicAuth, async (req, res) => {

    try {
        const { batchId, testId } = req.body;

        // Fetch batch data for the given batchId
        const batchesData = await TestResult.findOne({ batchId }).lean();

        if (!batchesData) {
            return res.status(404).json({ statusCode: 404, message: 'Batch not found' });
        }

        // Find the relevant test from the test list
        const testData = batchesData.testList.find(test => test.testId == testId);

        if (!testData) {
            return res.status(404).json({ statusCode: 404, message: 'Test not found' });
        }

        const Student = require("../models/students");

        // Fetch all student data in parallel using Promise.all
        const newList = await Promise.all(testData.list.map(async (item) => {
            const studentData = await Student.findById(item.userId).lean();
            return {
                profileImage: studentData?.profileImage || null,
                name: studentData?.name || 'Unknown',
                marks: item.marks,
                userId: item.userId,
            };
        }));

        res.json({
            statusCode: 200,
            message: 'Success',
            data: newList,
        });

    } catch (e) {
        res.status(500).json({ statusCode: 500, message: 'Server error', error: e.message });
    }

});
router.post("/testResult/studentTestResult", basicAuth, async (req, res) => {

    try {
        const { batchId, testId, userId } = req.body;

        // Fetch batch data for the given batchId
        const batchesData = await TestResult.findOne({ batchId }).lean();

        if (!batchesData) {
            return res.status(404).json({ statusCode: 404, message: 'Batch not found' });
        }

        // Find the relevant test from the test list
        const testData = batchesData.testList.find(test => test.testId == testId);

        if (!testData) {
            return res.status(404).json({ statusCode: 404, message: 'Test not found' });
        }

        const Student = require("../models/students");
        const studentData = await Student.findById(userId).lean();
        let newList = {};
        for (let i = 0; i < testData.list.length; i++) {
            if (testData.list[i].userId == userId) {
                const item = testData.list[i];
                newList = {
                    profileImage: studentData?.profileImage || null,
                    name: studentData?.name || 'Unknown',
                    marks: item.marks,
                    grade: item.grade,
                    title: item.title,
                    correct: item.correct,
                    skip: item.skip,
                    wrong: item.wrong
                };
            }
        }

        res.json({
            statusCode: 200,
            message: 'Success',
            data: newList,
        });

    } catch (e) {
        res.status(500).json({ statusCode: 500, message: 'Server error', error: e.message });
    }

});
router.post("/testResult/studentTestQuestionsResult", basicAuth, async (req, res) => {

    try {
        const { batchId, testId, userId } = req.body;

        // Fetch batch data for the given batchId
        const batchesData = await TestResult.findOne({ batchId }).lean();

        if (!batchesData) {
            return res.status(404).json({ statusCode: 404, message: 'Batch not found' });
        }

        // Find the relevant test from the test list
        const testData = batchesData.testList.find(test => test.testId == testId);

        if (!testData) {
            return res.status(404).json({ statusCode: 404, message: 'Test not found' });
        }

        const Student = require("../models/students");
        const studentData = await Student.findById(userId).lean();
        let newList = [];
        for (let i = 0; i < testData.list.length; i++) {
            if (testData.list[i].userId == userId) {
                const item = testData.list[i];
                for (let k = 0; k < item.questions.length; k++) {
                    const newItem = item.questions[k];
                    newList.push({
                        question: newItem.question,
                        optionA: newItem.optionA,
                        optionB: newItem.optionB,
                        optionC: newItem.optionC,
                        optionD: newItem.optionD,
                        correctAnswer: newItem.correctAnswer,
                        selected: newItem.selected
                    });
                }
            }
        }

        res.json({
            statusCode: 200,
            message: 'Success',
            data: newList,
        });

    } catch (e) {
        res.status(500).json({ statusCode: 500, message: 'Server error', error: e.message });
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
