const express = require('express');
const taskmodel = require('../model/taskmodel');
const router = express.Router();

const { getTodo, createTodo, updateTodo, editTodo, deleteTodo} = require('../controllers/todocontroller');

router.get('/', getTodo);
router.post('/', createTodo);
router.put('update/:id', updateTodo);
router.get('edit/:id', editTodo);
router.delete('delete/:id', deleteTodo);

module.exports = router;