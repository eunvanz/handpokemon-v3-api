import Sequelize from 'sequelize';

class Achievement extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        attrCd: {
          type: DataTypes.STRING(4),
          allowNull: false
        },
        achievementTypeCd: {
          type: DataTypes.STRING(4),
          allowNull: false
        },
        conditionValue: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        name: {
          type: DataTypes.String(20),
          allowNull: false
        },
        reward: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        burf: {
          type: DataTypes.STRING(30),
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'achievements',
        modelName: 'achievement'
      }
    );
  }
}

export default Achievement;
