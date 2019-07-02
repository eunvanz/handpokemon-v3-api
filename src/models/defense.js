import Sequelize from 'sequelize';

class Defense extends Sequelize.Model {
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
        seq: {
          type: DataTypes.SMALLINT,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'defenses',
        modelName: 'defense'
      }
    );
  }
}

export default Defense;
