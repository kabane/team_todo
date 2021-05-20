const Controller = require('../controller');
const models = require('../../models');
const { ValidationError } = require('sequelize');

class TeamsController extends Controller {
  // GET /:id
  async show(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    const tasks = await team.getTasks({
      include: ['team', 'assignee'],
      order: [['status', 'DESC'], ['updatedAt', 'DESC']]
    });
    res.render('manager/teams/show', { team, tasks });
  }

  // GET /:id/edit
  async edit(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    res.render('manager/teams/edit', { team });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    try {
      team.set(req.body);
      await team.save({ fields: ['name'] });
      await req.flash('info', '更新しました');
      res.redirect(`/manager/teams/${team.id}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.render('manager/teams/edit', { team, err: err });
      } else {
        throw err;
      }
    }
  }
}

module.exports = TeamsController;