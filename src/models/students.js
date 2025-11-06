const mongoose = require("mongoose");
const validator = require("validator");
const Institution = require("./institutes");


const batchSchema = new mongoose.Schema({
    id: String,
    attendance: [
        {
            date: String,
            status: String,
        }
    ]
})
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email id already present"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        min: 10,
        required: true,
        unique: true
    },

    absent: {
        type: String,
        required: false,

    },
    registrationDate:String,
    present: {
        type: String,
        required: false,
    },
    month: {
        type: String,
        required: false,
    },
    profileImage: {
        type: String,
        required: false,
    },
    otp: String,
    isVerified: Boolean,
    batches: [batchSchema],
    attendence: {
        type: [{
            month: String,
            attendence: String
        }],
        required: false
    },
    institutionCode: String,
})

const Student = new mongoose.model('Student', studentSchema);

module.exports = Student;