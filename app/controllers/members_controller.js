const Controller = require('./controller');
const models = require('../models');

class MembersController extends Controller {
  // GET /
  async index(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    const members = await team.getMembers({include: 'user' });
    const users = await models.User.findAll();
    res.render('members/index', { team, members, users });
  }

  // POST /
  async store(req, res) {
    const team = await models.Team.findByPk(req.params.team);
    await team.createMember({ userId: req.body.userId });
    res.redirect(`/teams/${team.id}/members/`);
  }
}

module.exports = MembersController;