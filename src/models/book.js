import Sequelize from 'sequelize';

class Book extends Sequelize.Model {
  static associate(models) {
    this.belongsTo(models.Collection, {
      foreignKey: 'colId',
      as: 'col'
    });
  }
  static init(sequelize, DataTypes) {
    return super.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        colId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        attrCd: {
          type: DataTypes.STRING(4),
          allowNull: false
        },
        seq: {
          type: DataTypes.SMALLINT,
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

export default Book;
