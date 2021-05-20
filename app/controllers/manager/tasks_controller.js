const Controller = require('../controller');
const models = require('../../models');
const { ValidationError } = require('sequelize');

class TasksController extends Controller {
  // GET /create
  async create(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    const task = models.Task.build();
    const members = await team.getMembers({
      include: ['user'],
      order: [['id']]
    });
    
    res.render('manager/tasks/create', { team, task, members });
  }

  // POST /
  async store(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    const task = models.Task.build(req.body);
    task.set({
      assigneeId: (req.body.assigneeId === '') ? null : req.body.assigneeId,
      teamId: team.id,
      creatorId: req.user.id
    });
    try {
      await task.save({ fields: ['title', 'body', 'teamId', 'assigneeId', 'creatorId'] });
      await req.flash('info', '新規タスクを作成しました');
      res.redirect(`/manager/teams/${team.id}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        const users = await team.getUsers({ order: [['id']] });
        res.render('/manager/teams/${team.id}/tasks/create', { team, task, users, err: err });
      } else {
        throw err;
      }
    }
  }

  // GET /:id/edit
  async edit(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    const tasks = await team.getTasks({ where: { id: req.params.task } });
    const task = tasks[0];

    if (task) {
      const members = await team.getMembers({
        include: ['user'],
        order: [['id']]
      });
      res.render('manager/tasks/edit', { team, task, members });
    } else {
      await req.flash('info', 'タスクが存在しないか編集権限がありません');
      res.redirect(`/manager/teams/${team.id}`); 
    }
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    const tasks = await team.getTasks({ where: { id: req.params.task } });
    const task = tasks[0];

    try {
      task.set(req.body);
      task.assigneeId = (req.body.assigneeId === '') ? null : req.body.assigneeId;
      await task.save({ fields: ['title', 'body', 'assigneeId'] });
      await req.flash('info', '更新しました');
      res.redirect(`/manager/teams/${team.id}/tasks/${task.id}/edit`);
    } catch (err) {
      if (err instanceof ValidationError) {
        const users = await team.getUsers({ order: [['id']] });
        res.render('manager/tasks/edit', { team, task, users, err: err });
      } else {
        throw err;
      }
    }
  }
}

module.exports = TasksController;