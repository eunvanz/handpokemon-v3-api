import Sequelize from 'sequelize';

class UserItem extends Sequelize.Model {
  static associate(models) {
    this.belongsTo(models.Item, {
      foreignKey: 'itemId',
      as: 'item'
    });
  }
  static init(sequelize, DataTypes) {
    return super.init(
      {
        itemId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        used: {
          type: DataTypes.TINYINT,
          allowNull: false,
          default: 0
        }
      },
      {
        sequelize,
        tableName: 'user_items',
        modelName: 'userItem'
      }
    );
  }
}

export default UserItem;
