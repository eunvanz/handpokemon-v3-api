import Sequelize from 'sequelize';

class Mon extends Sequelize.Model {
  static associate(models) {
    this.hasMany(models.Mon, {
      foreignKey: 'prevMonId',
      as: 'nextMons'
    });
    this.hasMany(models.MonImage, {
      foreignKey: 'monId',
      as: 'monImages'
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
        name: {
          type: DataTypes.STRING(20),
          allowNull: false
        },
        cost: {
          type: DataTypes.TINYINT,
          allowNull: false
        },
        mainAttrCd: {
          type: DataTypes.STRING(4),
          allowNull: false
        },
        subAttrCd: {
          type: DataTypes.STRING(4)
        },
        prevMonId: {
          type: DataTypes.SMALLINT
        },
        gradeCd: {
          type: DataTypes.STRING(4),
          allowNull: false
        },
        description: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        generation: {
          type: DataTypes.TINYINT,
          allowNull: false
        },
        height: {
          type: DataTypes.DECIMAL(4, 1),
          allowNull: false
        },
        weight: {
          type: DataTypes.DECIMAL(4, 1),
          allowNull: false
        },
        point: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        hp: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        power: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        armor: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        dex: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        sPower: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        sArmor: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        total: {
          type: DataTypes.SMALLINT,
          allowNull: false
        },
        requiredEvolutionLv: {
          type: DataTypes.SMALLINT
        }
      },
      {
        sequelize,
        tableName: 'mons',
        modelName: 'mon'
      }
    );
  }
}

export default Mon;
