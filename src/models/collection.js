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
    this.hasMany(models.MonImage, {
      foreignKey: 'monId',
      sourceKey: 'monId',
      as: 'monImages'
    });
    this.hasMany(models.Mon, {
      foreignKey: 'prevMonId',
      sourceKey: 'monId',
      as: 'nextMons',
      constraints: false
    });
  }
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
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
        baseHp: {
          type: DataTypes.SMALLINT,
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
        addedHp: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0
        },
        addedPower: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0
        },
        addedArmor: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0
        },
        addedDex: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0
        },
        addedSPower: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0
        },
        addedSArmor: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0
        },
        addedTotal: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0
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
        },
        defense: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0
        },
        favorite: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0
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
