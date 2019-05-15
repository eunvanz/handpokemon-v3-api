import Sequelize from 'sequelize';

class MonImage extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        url: {
          type: DataTypes.STRING(250),
          allowNull: false
        },
        monId: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        seq: {
          type: DataTypes.SMALLINT,
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
