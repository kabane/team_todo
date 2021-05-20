const Controller = require('./controller');
const models = require('../models');
const { ValidationError } = require('sequelize');

class TeamsController extends Controller {
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
      await req.flash('info', `新規チーム${team.name}を作成しました`)
      await models.Member.create({
        teamId: team.id,
        userId: req.user.id,
        role: models.Member.roles.manager
      });

      res.redirect(`/`);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.render('teams/create', { team: req.body, err: err });
      } else {
        throw err;
      }
    }
  }

}

module.exports = TeamsController;