import Sequelize from 'sequelize';

class Like extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        workshopId: {
          type: DataTypes.INTEGER
        },
        articleId: {
          type: DataTypes.INTEGER
        }
      },
      {
        sequelize,
        tableName: 'likes',
        modelName: 'like'
      }
    );
  }
}

export default Like;
