'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      this.Team = this.belongsTo(models.Team, {
        as: 'team',
        foreignKey: 'teamId'
      });

      this.Creator = this.belongsTo(models.User, {
        as: 'creator',
        foreignKey: 'creatorId'
      });

      this.Assignee = this.belongsTo(models.User, {
        as: 'assignee',
        foreignKey: 'assigneeId'
      });

    }
  };
  Task.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'タイトルは空ではいけません'
        },
        len: { 
          msg: 'タイトルは10文字未満です',
          args: [0, 10]
        }
      }
    },    
    body: { 
      type: DataTypes.TEXT,
      validate: {
        len: { 
          msg: '本文は30文字未満です',
          args: [0, 30]
        }
      }
    },
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });
  Task.statuses = { notStarted: 0, finished: 1, archived: 2 };
  return Task;
};