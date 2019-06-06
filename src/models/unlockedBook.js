import Sequelize from 'sequelize';

class UnlockedBook extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        userId: {
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
        tableName: 'unlocked_books',
        modelName: 'unlockedBook'
      }
    );
  }
}

export default UnlockedBook;
