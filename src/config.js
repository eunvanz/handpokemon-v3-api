import path from 'path';
import merge from 'lodash/merge';

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe');
  dotenv.load({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../.env.example')
  });
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    masterKey: process.env.MASTER_KEY,
    jwtSecret: process.env.JWT_SECRET
  },
  development: {
    port: process.env.PORT || 9999,
    sequelize: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      dialect: process.env.DB_DIALECT
    }
  },
  production: {
    port: process.env.PORT || 8080
  },
  test: {
    sequelize: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      dialect: process.env.DB_DIALECT
    }
  }
};

module.exports = merge(config.all, config[config.all.env]);
export default module.exports;
