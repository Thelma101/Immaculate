const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphandlebars = require('express-handlebars')
const path = require('path')
require('dotenv').config()
const cors = require('cors')
const taskmodel = require('./model/taskmodel')
const { log } = require('util')
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
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const profile = {
    
}

app.get('/', async (req, res) => {
    const message = req.query?.message;
    const error = req.query?.message;
    console.log(`My parameters are ${message} and ${error}`)
    const tasks = await taskmodel.find();
    let empty = false;
    if (tasks.length === 0) {
        empty = true;
    }
    res.render('index', { todos: tasks, empty: empty, errorMessage: "Error Occurred" })
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
    // console.log(newTask);
    if (!newTask || newTask.trim() === "") {
        console.log("Task is empty")
        return res.redirect('/?error=Please enter a task')
    }
    await taskmodel.create({ title: newTask })
    res.redirect('/?success=Task added successfully')
});

app.get('/update/:id', async (req, res) => {
    // const taskId = await taskmodel.findById(req.params.id);
    // console.log(taskId)
    // // res.redirect('/');
    // res.render('index');
    const taskId = req.params.id;
    const existingId = await taskmodel.findOne({ _id: taskId })
    if (!existingId) {
        console.log("Task not found");
        return res.redirect("/?error=Task not found");
    }

    existingId.completed = !existingId.completed;
    await existingId.save();
    res.redirect("/?success=Task updated successfully")
});

app.post("/edit/:id", async (req, res) => {
    const taskId = req.params.id;
    const existingId = await taskmodel.findOne({ _id: taskId })
    if (!existingId) {
        console.log("Task not found");
        return res.redirect("/");
    }
    // existingId.title = req.body.todotask;
    // await existingId.save();
    const { updated_task } = req.body;
    if (!updated_task || updated_task.trim() === "") {
        console.log("Task is empty");
        return res.redirect("/?error=Please enter a task");
    }
    existingId.title = updated_task;
    await existingId.save();
    res.redirect("/?success=Task updated successfully");
});

app.get('/delete/:id', async (req, res) => {
    // const task = await taskmodel.findByIdAndDelete(req.body.id)
    // res.redirect('/')
    try {
        const taskId = req.params.id
        const existingId = await taskmodel.findOne({ _id: taskId })
        if (!existingId) {
            console.log("Task not found");
            res.redirect("/?error=Task not found");
        }
        await taskmodel.findByIdAndDelete(existingId);
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.redirect("/?error=Error occurred while deleting the task");
    }
});

app.listen(PORT, () => {
    console.log(`Application server is running on port ${PORT}`)
});