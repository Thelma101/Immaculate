const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphandlebars = require('express-handlebars')
const path = require('path')
require('dotenv').config()
const cors = require('cors')
const taskmodel = require('./model/taskmodel')
const PORT = process.env.PORT || 3000

app.use(cors())

const url = process.env.MONGODB_URI
mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.log(`Error connecting to MongoDB: ${err}`)
})

// app engine
app.engine('hbs', exphandlebars.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}))

// view engine
app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', async (req, res) => {
    const tasks = await taskmodel.find()
    console.log(tasks);
    res.render('index', {todos: tasks})
})

// works
// app.post('/', async (req, res) => {
//     const task = req.body.todotask

//     if (!task || task.trim() === "") {
//     //    alert("Please enter a task")
//     // return res.redirect('/?error=Please enter a task')
//         console.log("Task is empty")
//         return res.redirect('/')
//     }
//     const newTask = new taskmodel({
//         title: task,
//         completed: false
//     })
//     await newTask.save()
//     res.redirect('/')
// })

app.post('/', async (req, res) => {
    const newTask = req.body.todotask
    console.log(newTask);
    if (!newTask || newTask.trim() === "") {
        console.log("Task is empty")
        return res.redirect('/')
    }
    await taskmodel.create({title: newTask})
    res.redirect('/')
})

app.delete('/', async (req, res) => {
    const task = await taskmodel.findByIdAndDelete(req.body.id)
    res.redirect('/')
})

app.listen(PORT, () => {
    console.log(`Application server is running on port ${PORT}`)
})