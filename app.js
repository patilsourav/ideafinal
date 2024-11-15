const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Student = require('./models/student');
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb+srv://patilsourav:test123@cluster0.ewc54.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    const students = await Student.find();
    res.render('index', { students });
});

app.get('/add-student', (req, res) => {
    res.render('add-student');
});

app.post('/add-student', async (req, res) => {
    const { name, usn, date, attends } = req.body;
    const student = new Student({ name, usn, attendance: [{ date, attends: attends === 'on' }] });
    await student.save();
    res.redirect('/');
});

app.get('/add-attendance/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('add-attendance', { student });
});

app.post('/add-attendance/:id', async (req, res) => {
    const { date, attends } = req.body;
    const student = await Student.findById(req.params.id);
    student.attendance.push({ date, attends: attends === 'on' });
    await student.save();
    res.redirect('/');
});

app.post('/check-attendance/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    const totalClasses = student.attendance.length;
    const attendedClasses = student.attendance.filter(record => record.attends).length;
    const attendancePercentage = (attendedClasses / totalClasses) * 100;
    res.render('attendance', { student, attendancePercentage });
});

app.post('/remove-student/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});