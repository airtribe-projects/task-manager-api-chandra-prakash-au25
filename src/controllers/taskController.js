const Task = require('../models/task');
const mongoose = require('mongoose');
class TaskController {
    async getAllTasks(req, res) {
        try {
            const { completed, sortBy } = req.query;
            let query = {};
            
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
            const tasks = await Task.find({ priority: level });
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createTask(req, res) {
        try {
            const { title, description, completed, priority } = req.body;
            
            // Validation
            if (!title || !description) {
                return res.status(400).json({ 
                    error: 'Validation failed',
                    details: 'Title and description are required'
                });
            }
            
            if (typeof completed !== 'boolean' && completed !== undefined) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: 'Completed must be a boolean'
                });
            }
            
            const task = new Task({
                title,
                description,
                completed: completed || false,
                priority: priority || 'medium'
            });
            
            await task.save();
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ 
                error: 'Error creating task',
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
