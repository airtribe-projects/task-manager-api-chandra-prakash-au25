const Task = require('../models/task');
const mongoose = require('mongoose');
class TaskController {
    async getAllTasks(req, res) {
        try {
            const tasks = await Task.find({}).sort({ createdAt: -1 });
            res.json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ 
                error: 'Failed to fetch tasks',
                details: error.message 
            });
        }
    }

    async getTaskById(req, res) {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ error: 'Invalid task ID' });
            }
            
            const task = await Task.findById(req.params.id);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
            console.error('Error fetching task:', error);
            res.status(500).json({ 
                error: 'Failed to fetch task',
                details: error.message 
            });
        }
    }

    async createTask(req, res) {
        try {
            if (!req.body.title) {
                return res.status(400).json({ error: 'Title is required' });
            }
            
            const task = new Task({
                title: req.body.title,
                description: req.body.description || '',
                completed: req.body.completed || false
            });
            
            const savedTask = await task.save();
            res.status(201).json(savedTask);
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(400).json({ 
                error: 'Failed to create task',
                details: error.message 
            });
        }
    }

    async updateTask(req, res) {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ error: 'Invalid task ID' });
            }
            
            const updates = {};
            if (req.body.title) updates.title = req.body.title;
            if (req.body.description) updates.description = req.body.description;
            if (typeof req.body.completed === 'boolean') updates.completed = req.body.completed;
            
            const task = await Task.findByIdAndUpdate(
                req.params.id,
                updates,
                { new: true, runValidators: true }
            );
            
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ 
                error: 'Failed to update task',
                details: error.message 
            });
        }
    }

    async deleteTask(req, res) {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ error: 'Invalid task ID' });
            }
            
            const task = await Task.findByIdAndDelete(req.params.id);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ 
                error: 'Failed to delete task',
                details: error.message 
            });
        }
    }
}

module.exports = new TaskController();