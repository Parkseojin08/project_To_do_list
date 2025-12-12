const express = require('express');
const router = express.Router();
const todosController = require('../../controller/todosController.js');

router.get('/',todosController.getTodos);
router.post('/',todosController.postTodos);
router.put('/:id',todosController.putTodos);
router.delete('/:id',todosController.deleteTodos);


module.exports = router;
