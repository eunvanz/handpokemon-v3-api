import Sequelize from 'sequelize';
import config from '../config';
import UserModel from './user';
import MonModel from './mon';
import CodeModel from './code';
import CollectionModel from './collection';
import MonImageModel from './monImage';

const envConfig = config[process.env.NODE_ENV];
const sequelizeConfig = envConfig.sequelize;

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
  MonImage: MonImageModel.init(sequelize, Sequelize),
  Mon: MonModel.init(sequelize, Sequelize),
  Collection: CollectionModel.init(sequelize, Sequelize),
  User: UserModel.init(sequelize, Sequelize),
  Code: CodeModel.init(sequelize, Sequelize)
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

const db = {
  ...models,
  sequelize
};

export default db;
