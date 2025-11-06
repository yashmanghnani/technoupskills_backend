const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    optionA: String,
    optionB: String,
    optionC: String,
    optionD: String,
    correctAnswer: String,
    selected: String
});

const testResultSchema = new mongoose.Schema({
    userId: String,
    marks: String,
    grade: String,
    title: String,
    name: String,
    correct: String,
    skip: String,
    wrong: String,
    questions: [questionSchema]
});

const testSchema = new mongoose.Schema({
    testId: String,
    list: [testResultSchema]
});

const batchTestSchema = new mongoose.Schema({
    batchId: String,
    batchName: String,
    testList: [testSchema]
});

const TestResult = mongoose.model('TestResult', batchTestSchema);

module.exports = TestResult;
