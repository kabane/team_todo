'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.Team = this.belongsTo(models.Team, {
        foreignKey: 'teamId',
        as: 'team'
      });

      this.User = this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  };
  Member.init({
    role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Member',
  });
  Member.roles = { normal: 0, manager: 1 };
  return Member;
};