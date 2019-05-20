import Sequelize from 'sequelize';
import { ROLE, SOCIAL_TYPE } from '../constants/codes';

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(50),
          allowNull: false
        },
        password: {
          type: DataTypes.STRING(100)
        },
        socialTypeCd: {
          type: DataTypes.STRING(4),
          allowNull: false,
          defaultValue: SOCIAL_TYPE.EMAIL
        },
        nickname: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true
        },
        profileImage: {
          type: DataTypes.STRING(200)
        },
        introduce: {
          type: DataTypes.STRING(80)
        },
        colPoint: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        role: {
          type: DataTypes.STRING(4),
          allowNull: false,
          defaultValue: ROLE.USER
        },
        pickCredit: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 12
        },
        battleCredit: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 12
        },
        lastPick: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        lastBattle: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        pokemoney: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      },
      {
        sequelize,
        tableName: 'users',
        modelName: 'user',
        defaultScope: {
          attributes: { exclude: ['password', 'email'] }
        }
      }
    );
  }
}

export default User;
