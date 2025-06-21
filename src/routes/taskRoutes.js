const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// All task routes now require authentication
router.use(auth);

router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.get('/priority/:level', taskController.getTasksByPriority);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
