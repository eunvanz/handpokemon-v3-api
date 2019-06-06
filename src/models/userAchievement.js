import Sequelize from 'sequelize';

class UserAchievement extends Sequelize.Model {
  static associate(models) {
    this.belongsTo(models.Achievement, {
      foreignKey: 'achievementId',
      as: 'achievement'
    });
  }
  static init(sequelize, DataTypes) {
    return super.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        achievementId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        activated: {
          type: DataTypes.TINYINT,
          allowNull: false
        },
        disabled: {
          type: DataTypes.TINYINT,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'user_achievements',
        modelName: 'userAchievement'
      }
    );
  }
}

export default UserAchievement;
