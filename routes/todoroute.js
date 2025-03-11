const express = require('express');
const router = express.Router();
const { getTodo, createTodo, updateTodo, editTodo, deleteTodo, updates } = require('../controllers/todocontroller');


router.get('/', getTodo);
router.post('/', createTodo);
router.get('/update/:id', updateTodo);
router.post('/edit/:id', editTodo);
router.get('/delete/:id', deleteTodo);
router.get('/updates/:id', updates);

module.exports = router;