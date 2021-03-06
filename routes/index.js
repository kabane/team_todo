const { Route } = require('../lib/route');
const forceLogin = require('../app/middlewares/force_login');
const forceAdmin = require('../app/middlewares/force_admin');
const managableTeam = require('../app/middlewares/managable_team');

const route = new Route();

// function style
route.get('/', 'top_controller@index');

// single style
route.get('/user/edit', forceLogin, 'users_controller@edit');
route.put('/user', forceLogin, 'users_controller@update');

const managerRoute = route.sub('/manager', forceLogin);
managerRoute.resource('teams', managableTeam, {
  controller: 'manager/teams_controller', only: ['show', 'edit', 'update']
});

const teamRoute = managerRoute.sub('/teams/:team', managableTeam);
teamRoute.resource('tasks', { controller: 'manager/tasks_controller', only: ['create', 'store', 'edit', 'update'] });
teamRoute.resource('members', { controller: 'manager/members_controller', only: ['index', 'store'] });

route.resource('/teams', { controller: 'teams_controller', only: ['create', 'store'] });
route.resource('tasks', { controller: 'tasks_controller', only: ['show'] });

// resource style
route.resource('examples', 'examples_controller');

// /adminのURL階層の作成。ログインチェック、管理者チェックが有効。
const adminRoute = route.sub('/admin', forceLogin, forceAdmin);
adminRoute.resource('users', 'admin/users_controller');

module.exports = route.router;
