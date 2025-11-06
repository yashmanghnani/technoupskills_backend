const mongoose = require("mongoose");

mongoose.connect("mongodb://admin:Yash%40Edith%401234@127.0.0.1:27017/students-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 45000,
    socketTimeoutMS: 45000,
}).then(() => {
    console.log("Connection is successfull");
}).catch((e) => {
    console.log("Error No connection");
});