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
      const team = await models.Team.createWithOwner(req.user, req.body);
      await req.flash('info', `新規チーム${team.name}を作成しました`)
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