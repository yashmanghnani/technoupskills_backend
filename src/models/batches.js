const mongoose = require("mongoose");

const lastAttendenceSchema = new mongoose.Schema({
    month: String,
    attendence: String
});
const studentList = new mongoose.Schema({
    uid: String,
    attendance: String
});
const lastAttendenceSchema1 = new mongoose.Schema({
    date: String,
    attendance: [studentList]
});


const batchesSchema = new mongoose.Schema({

    batchName: String,
    syllabus: String,
    attendance: [lastAttendenceSchema1],
    institutionCode: String,
    list: [{
        id: String,
        name: String,
        profileImage: String,
        attendence: String,
        todaysDate: String,
        month: String,
        totalAttendence: String,
        fees: String,
        lastAttendence: [lastAttendenceSchema]
    }]

});
const Batche = mongoose.model('Batche', batchesSchema);

module.exports = Batche;
