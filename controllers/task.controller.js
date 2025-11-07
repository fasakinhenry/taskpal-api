const Joi = require('joi');
const Task = require('../models/Task');
const User = require('../models/User');
const response = require('../utils/response');
const { encodeCursor, decodeCursor } = require('../utils/pagination');

class TaskController {
  // POST /api/tasks
  static async createTask(req, res, next) {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      budget: Joi.number().required(),
      location: Joi.string().allow('', null),
      category: Joi.string().allow('', null),
    });
    try {
      // Validate request body
      const { error, value } = schema.validate(req.body);

      if (error) return response(res, 422, error.details[0].message);

      const task = await Task.create({
        ...value,
        createdBy: req.user._id,
      });

      // add to user's tasksPosted
      await User.findByIdAndUpdate(req.user._id, {
        $push: { tasksPosted: task._id },
      });

      return response(res, 201, 'Task created', { task });
    } catch (error) {
      next(err);
    }
  }
  // GET /api/tasks?limit=10&cursor=base64&status=open
  static async listTasks(req, res, next) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
      const cursor = req.query.cursor || null;
      const status = req.query.status || 'open';

      const filter = {};
      if (status) filter.status = status;

      // if cursor provided, filter for older docs
      if (cursor) {
        const decoded = decodeCursor(cursor);
        if (decoded) {
          // we want items strictly before the cursor's createdAt OR if equal then id < cursor id
          filter.$or = [
            { createdAt: { $lt: decoded.createdAt } },
            { createdAt: decoded.createdAt, _id: { $lt: decoded._id } },
          ];
        }
      }

      const docs = await Task.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit + 1) // fetch one extra to detect next
        .populate('createdBy', 'name email')
        .populate('acceptedBy', 'name email');

      const hasMore = docs.length > limit;
      const results = hasMore ? docs.slice(0, limit) : docs;

      const nextCursor = hasMore
        ? encodeCursor(results[results.length - 1])
        : null;

      return response(res, 200, 'Tasks fetched', {
        tasks: results,
        nextCursor,
      });
    } catch (error) {
      next(err);
    }
  }

  // GET /api/tasks/:id
  static async getTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id)
        .populate('createdBy', 'name email')
        .populate('acceptedBy', 'name email');
      if (!task) return response(res, 404, 'Task not found');
      return response(res, 200, 'Task fetched', { task });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/tasks/:id/accept
  static async acceptTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) return response(res, 404, 'Task not found');

      if (task.createdBy.toString() === req.user._id.toString()) {
        return response(res, 403, 'You cannot accept your own task');
      }

      if (task.status !== 'open')
        return response(res, 409, 'Task not open for acceptance');

      task.status = 'accepted';
      task.acceptedBy = req.user._id;
      await task.save();

      await User.findByIdAndUpdate(req.user._id, {
        $push: { tasksAccepted: task._id },
      });

      return response(res, 200, 'Task accepted', { task });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/tasks/:id/complete
  static async completeTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) return response(res, 404, 'Task not found');

      if (
        !task.acceptedBy ||
        task.acceptedBy.toString() !== req.user._id.toString()
      ) {
        return response(res, 403, 'Only the accepter can mark task complete');
      }

      if (task.status !== 'accepted')
        return response(res, 409, 'Task not in accepted state');

      task.status = 'completed';
      await task.save();

      return response(res, 200, 'Task marked as completed', { task });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/tasks/:id/pay
  static async payTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) return response(res, 404, 'Task not found');

      if (task.createdBy.toString() !== req.user._id.toString()) {
        return response(res, 403, 'Only the creator can mark task as paid');
      }

      if (task.status !== 'completed')
        return response(
          res,
          409,
          'Task must be completed before marking as paid'
        );

      task.status = 'paid';
      await task.save();

      return response(res, 200, 'Task marked as paid', { task });
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/tasks/:id (update task) — only creator and before accepted
  static async updateTask(req, res, next) {
    const schema = Joi.object({
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      budget: Joi.number().optional(),
      location: Joi.string().allow('', null).optional(),
      category: Joi.string().allow('', null).optional(),
    });

    try {
      const { error, value } = schema.validate(req.body);
      if (error) return response(res, 422, error.details[0].message);

      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) return response(res, 404, 'Task not found');

      if (task.createdBy.toString() !== req.user._id.toString())
        return response(res, 403, 'Only creator can update');

      if (task.status !== 'open')
        return response(res, 409, 'Cannot update after task is accepted');

      Object.assign(task, value);
      task.updatedAt = new Date();
      await task.save();

      return response(res, 200, 'Task updated', { task });
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/tasks/:id (delete) — only creator and before accepted
  static async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) return response(res, 404, 'Task not found');

      if (task.createdBy.toString() !== req.user._id.toString())
        return response(res, 403, 'Only creator can delete');

      if (task.status !== 'open')
        return response(res, 409, 'Cannot delete after task is accepted');

      await task.remove();
      // Remove refs from user
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tasksPosted: task._id },
      });

      return response(res, 200, 'Task deleted');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TaskController;
