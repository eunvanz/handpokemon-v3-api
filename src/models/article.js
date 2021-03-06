import Sequelize from 'sequelize';

class Article extends Sequelize.Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    this.hasMany(models.Comment, {
      foreignKey: 'articleId',
      as: 'comments'
    });
    this.hasMany(models.Like, {
      foreignKey: 'articleId',
      as: 'likes'
    });
  }
  static init(sequelize, DataTypes) {
    return super.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        title: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        categoryCd: {
          type: DataTypes.STRING(4),
          allowNull: false
        },
        views: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      },
      {
        sequelize,
        tableName: 'articles',
        modelName: 'article'
      }
    );
  }
}

export default Article;
