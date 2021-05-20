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
      this.Member = models.Member;
      
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

    static async createWithOwner(user, params) {
      return await sequelize.transaction(async (t) => {
        const team = this.build(params);
        team.set({
          ownerId: user.id
        });
        await team.save({ fields: ['name', 'ownerId'], transaction: t });
        await this.Member.create({
          teamId: team.id,
          userId: user.id,
          role: 1
        }, { transaction: t });

        return team;
      });
    }

    async isManager(user) {
      return await this.countMembers({
        where: {
          role: 1,
          userId: user.id
        }
      }) != 0;
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