import Sequelize from 'sequelize';

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true
        },
        socialTypeCd: {
          type: DataTypes.STRING(4),
          allowNull: false
        },
        nickname: {
          type: DataTypes.STRING(20),
          allowNull: false
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
        }
      },
      {
        sequelize,
        tableName: 'users',
        modelName: 'user'
      }
    );
  }
}

export default User;
