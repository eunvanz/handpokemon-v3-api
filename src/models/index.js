import Sequelize from 'sequelize';
import { sequelize as sequelizeConfig } from '../config';
import UserModel from './user';
import MonModel from './mon';
import CodeModel from './code';
import CollectionModel from './collection';
import MonImageModel from './monImage';

const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  {
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect,
    define: {
      underscored: true
    },
    dialectOptions: {
      decimalNumbers: true
    }
  }
);

const models = {
  Code: CodeModel.init(sequelize, Sequelize),
  User: UserModel.init(sequelize, Sequelize),
  Mon: MonModel.init(sequelize, Sequelize),
  Collection: CollectionModel.init(sequelize, Sequelize),
  MonImage: MonImageModel.init(sequelize, Sequelize)
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

const db = {
  ...models,
  sequelize
};

export default db;
