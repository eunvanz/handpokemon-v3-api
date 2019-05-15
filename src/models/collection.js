import Sequelize from 'sequelize';

class Collection extends Sequelize.Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    this.belongsTo(models.Mon, {
      foreignKey: 'monId',
      as: 'mon'
    });
  }
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          primaryKey: true
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        monId: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        mainAttrCd: {
          type: DataTypes.STRING(4)
        },
        subAttrCd: {
          type: DataTypes.STRING(4)
        },
        height: {
          type: DataTypes.DECIMAL(4, 1),
          allowNull: false
        },
        weight: {
          type: DataTypes.DECIMAL(4, 1),
          allowNull: false
        },
        basePower: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        baseArmor: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        baseDex: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        baseSPower: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        baseSArmor: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        baseTotal: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        addedPower: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        addedArmor: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        addedDex: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        addedSPower: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        addedSArmor: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        addedTotal: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        level: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 1
        },
        rankCd: {
          type: DataTypes.STRING(4),
          allowNull: false
        },
        imageSeq: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 1
        }
      },
      {
        sequelize,
        tableName: 'collections',
        modelName: 'collection'
      }
    );
  }
}

export default Collection;