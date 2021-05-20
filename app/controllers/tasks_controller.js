
const Controller = require('./controller');
const models = require('../models');

class TasksController extends Controller {
  
  // GET /:id
  async show(req, res) {
    const task = await this._task(req);
    const team = await task.getTeam();

    res.render('tasks/show', { task, team });
  }

  async _task(req) {
    const task = await models.Task.findByPk(req.params.task);
    if (!task) {
      throw new Error('task not found');
    }
    return task;
  }
}

module.exports = TasksController;