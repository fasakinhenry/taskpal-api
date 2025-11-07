const response = require('../utils/response');
const User = require('../models/User');
const Task = require('../models/Task');

class UserController {
  // GET /api/users/me/tasks (my posted & accepted)
  static async myTasks(req, res, next) {
    try {
      const userId = req.user._id;

      const postedTasks = await Task.find({ postedBy: userId });
      const acceptedTasks = await Task.find({ acceptedBy: userId });
      return response(res, 200, "User's tasks fetched successfully", {
        postedTasks,
        acceptedTasks,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:id/tasks/posted
  static async postedTasks(req, res, next) {
    try {
      const { id } = req.params;
      const tasks = await Task.find({ createdBy: id }).sort({ createdAt: -1 });
      return response(res, 200, 'Posted tasks fetched successfully', { tasks });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:id/tasks/accepted
  static async acceptedTasks(req, res, next) {
    try {
      const { id } = req.params;
      const tasks = await Task.find({ acceptedBy: id }).sort({ createdAt: -1 });
      return response(res, 200, 'Accepted tasks fetched', { tasks });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/:id (public profile)
  static async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-password').lean();
      if (!user) return response(res, 404, 'User not found');
      return response(res, 200, 'User fetched', { user });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
