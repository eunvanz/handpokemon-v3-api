import Sequelize from 'sequelize';
import { sequelize as sequelizeConfig } from '../config';
import UserModel from './user';
import MonModel from './mon';
import CodeModel from './code';
import CollectionModel from './collection';
import MonImageModel from './monImage';
import BookModel from './book';
import UnlockedBookModel from './unlockedBook';
import AchievementModel from './achievement';
import UserAchievementModel from './userAchievement';
import ItemModel from './item';
import UserItemModel from './userItem';
import WorkshopModel from './workshop';
import ArticleModel from './article';
import LikeModel from './like';
import CommentModel from './comment';

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
    },
    timezone: '+09:00'
  }
);

const models = {
  Code: CodeModel.init(sequelize, Sequelize),
  User: UserModel.init(sequelize, Sequelize),
  Mon: MonModel.init(sequelize, Sequelize),
  Collection: CollectionModel.init(sequelize, Sequelize),
  MonImage: MonImageModel.init(sequelize, Sequelize),
  Book: BookModel.init(sequelize, Sequelize),
  UnlockedBook: UnlockedBookModel.init(sequelize, Sequelize),
  Achievement: AchievementModel.init(sequelize, Sequelize),
  UserAchievement: UserAchievementModel.init(sequelize, Sequelize),
  Item: ItemModel.init(sequelize, Sequelize),
  UserItem: UserItemModel.init(sequelize, Sequelize),
  Workshop: WorkshopModel.init(sequelize, Sequelize),
  Like: LikeModel.init(sequelize, Sequelize),
  Article: ArticleModel.init(sequelize, Sequelize),
  Comment: CommentModel.init(sequelize, Sequelize)
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

const db = {
  ...models,
  sequelize
};

export default db;
