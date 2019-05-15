import Sequelize from 'sequelize';

class Code extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        masterCd: {
          type: DataTypes.STRING(2),
          allowNull: false
        },
        masterCdNm: {
          type: DataTypes.STRING(20),
          allowNull: false
        },
        detailCd: {
          type: DataTypes.STRING(4),
          allowNull: false,
          primaryKey: true
        },
        detailCdNm: {
          type: DataTypes.STRING(20),
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'codes',
        modelName: 'code'
      }
    );
  }
}

export default Code;
