const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default:Date.now(),
    }
},
    // timestamps: true,
);

module.exports = mongoose.model('ToDo', taskSchema)