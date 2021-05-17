const Controller = require('./controller');
const models = require('../models');
const { ValidationError } = require('sequelize');

class TeamsController extends Controller {
  // GET /:id
  async show(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    const tasks = await team.getTasks({
      include: ['team'],
      order: [['status', 'DESC'], ['updatedAt', 'DESC']]
    });
    res.render('teams/show', { team, tasks });
  }

  // GET /create
  async create(_req, res) {
    const team = models.Team.build();
    res.render('teams/create', { team });
  }

  // POST /
  async store(req, res) {
    try {
      const team = models.Team.build(req.body);
      team.set({
        ownerId: req.user.id
      });
      await team.save({ fields: ['name', 'ownerId'] });
      await req.flash('info', `新規チーム${team.name}を作成しました`);
      res.redirect(`/teams/${team.id}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.render('teams/create', { team: req.body, err: err });
      } else {
        throw err;
      }
    }
  }

  // GET /:id/edit
  async edit(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    res.render('teams/edit', { team });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    try {
      team.set(req.body);
      await team.save({ fields: ['name'] });
      await req.flash('info', '更新しました');
      res.redirect(`/teams/${team.id}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.render('/teams/edit', { team, err: err });
      } else {
        throw err;
      }
    }
  }
}

module.exports = TeamsController;