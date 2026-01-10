const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskCreateValidation, taskUpdateValidation, validate } = require('../middleware/validator');

// All routes are protected
router.use(protect);

// Stats route must be before /:id route
router.get('/stats', getTaskStats);

router.route('/').get(getTasks).post(taskCreateValidation, validate, createTask);

router
  .route('/:id')
  .get(getTask)
  .put(taskUpdateValidation, validate, updateTask)
  .delete(deleteTask);

module.exports = router;
