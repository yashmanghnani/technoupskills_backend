const express = require("express");
require("./db/conn");
const studentRouter = require("./routers/student");
const teacherRouter = require("./routers/teacher");
const batcheRouter = require("./routers/batche");
const instituteRouter = require("./routers/institute");
const TestRouter = require("./routers/test");
const Update = require("./routers/update");
const TestResultRouter = require("./routers/testResult");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4002;


app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());
app.use(cors());
app.use(Update);
app.use(studentRouter);
app.use(teacherRouter);
app.use(instituteRouter);
app.use(batcheRouter);
app.use(TestRouter);
app.use(TestResultRouter);



app.listen(port, () => {
    console.log(`Connection is setup at ${port}`);
})
