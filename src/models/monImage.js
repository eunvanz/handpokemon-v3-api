import Sequelize from 'sequelize';

class MonImage extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        url: {
          type: DataTypes.STRING(1000),
          allowNull: false
        },
        monId: {
          type: DataTypes.SMALLINT
        },
        seq: {
          type: DataTypes.SMALLINT
        },
        designer: {
          type: DataTypes.STRING(10),
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'mon_images',
        modelName: 'monImage'
      }
    );
  }
}

export default MonImage;
