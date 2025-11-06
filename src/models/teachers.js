const mongoose = require("mongoose");
const validator = require("validator");


const batchSchema = new mongoose.Schema({
    type: String
})


const teacherSchema = new mongoose.Schema({
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
    profileImage: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        min: 10,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: false,
    },

    batchStudents: {
        type: [String],
        required: false,
    },
    batchList: [batchSchema],
})

const Teacher = new mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;