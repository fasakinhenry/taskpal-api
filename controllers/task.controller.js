const Task = require('../models/Task');

class TaskController {
  static async getallTasks(req, res) {
    const tasks = await Task.find({});
  }
  static async login(req, res) {}
  static async me(req, res) {}
}

module.exports = TaskController;
