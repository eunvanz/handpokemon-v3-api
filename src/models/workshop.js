import Sequelize from 'sequelize';

class Workshop extends Sequelize.Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    this.hasMany(models.Comment, {
      foreignKey: 'workshopId',
      as: 'comments'
    });
    this.hasMany(models.Like, {
      foreignKey: 'likeId',
      as: 'likes'
    });
  }
  static init(sequelize, DataTypes) {
    return super.init(
      {
        designer: {
          type: DataTypes.STRING(20),
          allowNull: false
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        image: {
          type: DataTypes.STRING(500),
          allowNull: false
        },
        registered: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0
        },
        monName: {
          type: DataTypes.STRING(20),
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'workshops',
        modelName: 'workshop'
      }
    );
  }
}

export default Workshop;
