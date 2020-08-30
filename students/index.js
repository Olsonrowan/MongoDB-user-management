const express = require('express')
const app = express()
const port = 3000
//configure the db connection
const mongoose = require('mongoose');
const { urlencoded } = require('express');
const dbConnectionString= 'mongodb://localhost/cohort10'; 
mongoose.connect(dbConnectionString, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }); 
const db = mongoose.connection; //connecting to the Database
//Here is a mini sample on how to provide requirements for a student document
const studentSchema = new mongoose.Schema({
    // student_id:{type:String, default: uuidv4()},
    first_name: String,
    last_name: String,
    email: String,
    age: { type: Number, min: 18, max: 70 },
 });
const student = mongoose.model('Students', studentSchema);

app.use(express.json())
app.use(urlencoded({extended: false}))
app.use(express.static('public'))

app.get("/getStudent", (req,res) =>{
    student.find({}, (err, data)=>{
       let result = JSON.stringify(data)
       res.send(result)

    })
})


app.post('/searchStudents', (req, res) => {
    first_name = req.body.first_name;
    student.find({first_name: first_name}, (err, data) => {
    res.send(`${data}`)
    })
})

app.post("/addStudents", (req,res) =>{
    const newStudent = new student()
    newStudent.first_name = req.body.first_name;
    newStudent.last_name = req.body.last_name;
    newStudent.email = req.body.email;
    newStudent.age = req.body.age;
    newStudent.save((err ,data) =>{
    res.send(`${data}`)

    })
})

app.post("/updateStudent", (req,res) =>{
    let newId = req.body._id
    let newFirstName = req.body.first_name;
    let newLastName = req.body.last_name;
    let newAge = req.body.age;
    let newEmail = req.body.email;

    student.findOneAndUpdate({_id: newId}, {first_name: newFirstName, last_name: newLastName, email: newEmail, age: newAge},
        {new: true},
        (err, data) =>{
        res.send(`${data}`)
        
    }
    )
})

app.post("/deleteStudent", (req,res) =>{
    let findToDelete = req.body.first_name;
    student.findOneAndDelete({first_name: findToDelete}, (err, data) =>{
        res.send(`${data}`)
    })

})

app.get('/sortStudentAsc', (req, res) => {
    student.find({}, (err, data) => {
        res.send(data)
    })
})

app.get('/sortStudentDesc', (req, res) => {
    student.find({}, (err, data) => {
        res.send(data)
    })
})



app.listen(port, (err) =>{
    if (err){
        console.log(err)
    }
    console.log('we are listening to port 3000');
})