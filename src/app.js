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
const { exec } = require('child_process');

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

app.post('/', async (req, res) => {
    try {
        const event = req.headers['x-github-event'];
        if (event !== 'push') return res.status(200).json({ message: 'Not a push event' });

        const payload = req.body;
        const branch = payload.ref;

        if (branch === 'refs/heads/main' || branch === 'refs/heads/master') {
            // Respond immediately to GitHub so it doesn't timeout
            res.status(200).json({ message: 'Deployment triggered' });

            // Then run the script asynchronously
            exec('/home/techno.sh', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Deployment error: ${error}`);
                } else {
                    console.log(`Deployment output: ${stdout}`);
                    if (stderr) console.error(`Deployment stderr: ${stderr}`);
                }
            });
        } else {
            return res.status(200).json({ message: 'Not main branch, skipping deployment' });
        }
    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({ success: false, error: `Something went wrong! ${err.stack}` });
    }
});

app.get('/', (req, res) => res.send("Api is working v2ss"));

app.listen(port, () => {
    console.log(`Connection is setup at ${port}`);
})
