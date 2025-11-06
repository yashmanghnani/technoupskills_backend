const mongoose = require("mongoose");
const validator = require("validator");



const teacherSchema = new mongoose.Schema({
    type: String
})

const batchSchema = new mongoose.Schema({
    type: String
})

const institutionSchema = new mongoose.Schema({
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
    profileImages: {
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
    teachersList: [teacherSchema],
    batchList: [batchSchema],
    institutionCode: String,


})

const Institution = new mongoose.model('Institution', institutionSchema);

module.exports = Institution;