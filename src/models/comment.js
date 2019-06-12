import Sequelize from 'sequelize';

class Comment extends Sequelize.Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    })
  }
  static init(sequelize, DataTypes) {
    return super.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        workshopId: {
          type: DataTypes.INTEGER,
        },
        articleId: {
          type: DataTypes.INTEGER,
        }
        content: {
          type: DataTypes.STRING(500),
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'comments',
        modelName: 'comment'
      }
    );
  }
}

export default Comment;
