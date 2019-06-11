import Sequelize from 'sequelize';

class Item extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        price: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        description: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        value: {
          type: DataTypes.STRING(50),
          allowNull: false
        },
        image: {
          type: DataTypes.STRING(200),
          allowNull: false
        },
        name: {
          type: DataTypes.STRING(20),
          allowNull: false
        },
        seq: {
          type: DataTypes.SMALLINT
        },
        itemTypeCd: {
          type: DataTypes.STRING(4),
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'books',
        modelName: 'book'
      }
    );
  }
}

export default Item;
