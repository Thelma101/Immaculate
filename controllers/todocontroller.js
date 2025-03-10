const taskmodel = require("../model/taskmodel");

const getTodo = async (req, res) => {
    try {
        const message = req.query?.message;
        const error = req.query?.message;
        console.log(`My parameters are ${message} and ${error}`)
        const tasks = await taskmodel.find();
        let empty = false;
        if (tasks.length === 0) {
            empty = true;
        }
        res.render('index', { todos: tasks, empty: empty, errorMessage: "Error Occurred" })
    } catch (error) {
        console.log(error);
        res.render('index', { errorMessage: "Error Occurred" })
    }
}

const createTodo = async (req, res) => {
    try {
        const newTask = req.body.todotask
        // console.log(newTask);
        if (!newTask || newTask.trim() === "") {
            console.log("Task is empty")
            return res.redirect('/?error=Please enter a task')
        }
        await taskmodel.create({ title: newTask })
        res.redirect('/?success=Task added successfully')
    } catch (error) {
        console.log(error);
        res.redirect('/?error=Error adding task')
    }
}

const updateTodo = async (req, res) => {
    // const taskId = await taskmodel.findById(req.params.id);
    // console.log(taskId)
    // // res.redirect('/');
    // res.render('index');
    try {
        const taskId = req.params.id;
        const existingId = await taskmodel.findOne({ _id: taskId })
        if (!existingId) {
            console.log("Task not found");
            return res.redirect("/?error=Task not found");
        }

        existingId.completed = !existingId.completed;
        await existingId.save();
        res.redirect("/?success=Task updated successfully")
    } catch (error) {
        console.log(error);
        res.redirect("/?error=Error occurred while updating the task");
    }
}

const editTodo =  async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({
            error: `error message ${error}`
            // res.redirect("/?error=Error occurred while updating the task");
        })
    }
}

const deleteTodo = async (req, res) => {
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
}

module.exports = { getTodo, createTodo, updateTodo, deleteTodo, editTodo }  