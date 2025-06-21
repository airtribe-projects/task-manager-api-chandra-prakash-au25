const Task = require('../models/task');
const mongoose = require('mongoose');

class TaskController {
    async getAllTasks(req, res) {
        try {
            const { completed, sortBy } = req.query;
            const query = { user: req.userId };
            
            if (completed) {
                query.completed = completed === 'true';
            }
            
            const sortOption = sortBy === 'createdAt' ? { createdAt: -1 } : {};
            const tasks = await Task.find(query).sort(sortOption);
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTasksByPriority(req, res) {
        try {
            const { level } = req.params;
            if (!['low', 'medium', 'high'].includes(level)) {
                return res.status(400).json({ error: 'Invalid priority level' });
            }
            
            const tasks = await Task.find({ 
                priority: level,
                user: req.userId 
            });
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createTask(req, res) {
        try {
            const task = new Task({
                ...req.body,
                user: req.userId
            });
            await task.save();
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getTaskById(req, res) {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ error: 'Invalid task ID' });
            }
            
            const task = await Task.findOne({ 
                _id: req.params.id,
                user: req.userId 
            });
            
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
            res.status(500).json({ 
                error: 'Failed to fetch task',
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
            
            const task = await Task.findOneAndUpdate(
                { 
                    _id: req.params.id,
                    user: req.userId 
                },
                updates,
                { new: true, runValidators: true }
            );
            
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
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
            
            const task = await Task.findOneAndDelete({ 
                _id: req.params.id,
                user: req.userId 
            });
            
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Failed to delete task',
                details: error.message 
            });
        }
    }
}

module.exports = new TaskController();
