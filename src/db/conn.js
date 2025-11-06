const mongoose = require("mongoose");

mongoose.connect("mongodb://admin:Yash%40Edith%401234@31.97.230.47:27017/students-api?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 45000,
    socketTimeoutMS: 45000,
}).then(() => {
    console.log("Connection is successfull");
}).catch((e) => {
    console.log("Error No connection");
});