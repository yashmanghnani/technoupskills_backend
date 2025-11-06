const mongoose = require("mongoose");

const questionslistSchema = new mongoose.Schema({
    question: String,
    optionA: String,
    optionB: String,
    optionC: String, // Corrected spelling
    optionD: String,
    correctAnswer: String,
});

const testStartedSchema = new mongoose.Schema({
    id: String,
    isVisible: Boolean,
});

const testsSchema = new mongoose.Schema({
    batchName: String,
    batchId: String,
    list: [{
        id: String,
        title: String,
        discription: String,
        testScTime:String,
        questions: String,
        time: String,
        date: String,
        isVisible: [testStartedSchema],
        questionsList: [questionslistSchema]
    }]
});

const Test = mongoose.model('Test', testsSchema);

module.exports = Test;
