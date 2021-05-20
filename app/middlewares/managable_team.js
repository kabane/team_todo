const models = require('../models');

module.exports = async function managableTeam(req, res, next) {
  const user = req.user;

  const team = await models.Team.findByPk(req.params.team);
  if (!team) {
    next(new Error('team not found'));
  }

  const managers = await models.Member.findAll({
    where: {
      role: 1,
      userId: user.id,
      teamId: team.id
    }
  });

  if (managers.length == 0) {
    await req.flash('alert', 'アクセスできません');
    res.redirect('/');
  }

  return next();
};
