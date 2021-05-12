const Controller = require('./controller');
const models = require('../models');
const { ValidationError } = require('sequelize');

class TasksController extends Controller {
  // GET /create
  async create(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    const task = models.Task.build();
    res.render('tasks/create', { team, task });
  }

  // POST /
  async store(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    const task = models.Task.build(req.body);
    task.set({
      teamId: team.id
    });
    try {
      await task.save({ fields: ['title', 'body', 'teamId'] });
      await req.flash('info', '新規タスクを作成しました');
      res.redirect(`/teams/${team.id}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        const users = await team.getUsers({ order: [['id']] });
        res.render('/teams/${team.id}/tasks/create', { team, task, users, err: err });
      } else {
        throw err;
      }
    }
  }

  // GET /:id/edit
  async edit(req, res) {
    const task = await models.Task.findByPk(req.params.task);
    const team = await task.getTeam();

    res.render('tasks/edit', { team, task });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const task = await models.Task.findByPk(req.params.task);
    const team = await task.getTeam();

    try {
      task.set(req.body);
      await task.save({ fields: ['title', 'body'] });
      await req.flash('info', '更新しました');
      res.redirect(`/teams/${team.id}/tasks/${task.id}/edit`);
    } catch (err) {
      if (err instanceof ValidationError) {
        const users = await team.getUsers({ order: [['id']] });
        res.render('tasks/edit', { team, task, users, err: err });
      } else {
        throw err;
      }
    }
  }
}

module.exports = TasksController;