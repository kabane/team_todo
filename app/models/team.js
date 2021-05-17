'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.Members = this.hasMany(models.Member, {
        foreignKey: 'teamId'
      });
      
      this.Tasks = this.hasMany(models.Task, {
        foreignKey: 'teamId'
      });

      this.Owner = this.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'owner'
      });
    }
  };
  Team.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'チーム名は必須です'
        }
      }
    },
    ownerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};