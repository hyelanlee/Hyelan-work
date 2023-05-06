import sql from 'mssql';
import env from '@root/config.json';

const pools = {}
const poolsLong = {}
const poolsShort = {}
const poolsGroup = {}

// 기본
const config = {
  user: env.MSSQL_USER,
  password: env.MSSQL_PASS,  
  server: env.MSSQL_URL,
  database: env.MSSQL_DB,
  port: parseInt(env.MSSQL_PORT),
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
    appName: env.MSSQL_NAME,
  },
  requestTimeout: 60000,
};

export const dbPool = async () => {
  const name = 'default';
  if (!Object.prototype.hasOwnProperty.call(pools, name)) {
    const pool = new sql.ConnectionPool(config);
    const close = pool.close.bind(pool);
    pool.close = (...args) => {
      delete pools[name];
      return close(...args)
    }
    await pool.connect();
    pools[name] = pool;
  }
  return pools[name];
}

// 기본(Long)
const configLong = {
  user: env.MSSQL_USER,
  password: env.MSSQL_PASS,  
  server: env.MSSQL_URL,
  database: env.MSSQL_DB,
  port: parseInt(env.MSSQL_PORT),
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
    appName: env.MSSQL_NAME,
  },
  requestTimeout: 300000,
};

export const dbPoolLong = async () => {
  const name = 'defaultLong';
  if (!Object.prototype.hasOwnProperty.call(poolsLong, name)) {
    const pool = new sql.ConnectionPool(configLong);
    const close = pool.close.bind(pool);
    pool.close = (...args) => {
      delete poolsLong[name];
      return close(...args)
    }
    await pool.connect();
    poolsLong[name] = pool;
  }
  return poolsLong[name];
}

// 기본(Short)
const configShort = {
  user: env.MSSQL_USER,
  password: env.MSSQL_PASS,  
  server: env.MSSQL_URL,
  database: env.MSSQL_DB,
  port: parseInt(env.MSSQL_PORT),
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 1000
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
    appName: env.MSSQL_NAME,
  },
  requestTimeout: 30000,
};

export const dbPoolShort = async () => {
  const name = 'defaultShort';
  if (!Object.prototype.hasOwnProperty.call(poolsShort, name)) {
    const pool = new sql.ConnectionPool(configShort);
    const close = pool.close.bind(pool);
    pool.close = (...args) => {
      delete poolsShort[name];
      return close(...args)
    }
    await pool.connect();
    poolsShort[name] = pool;
  }
  return poolsShort[name];
}

// GROUP
const configGroup = {
  user: env.MSSQL_USER,
  password: env.MSSQL_PASS,  
  server: env.MSSQL_URL,
  database: env.GROUP_DB,
  port: parseInt(env.MSSQL_PORT),
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
    appName: env.MSSQL_NAME,
  },
  requestTimeout: 15000,
};

export const dbPoolGroup = async () => {
  const name = 'group';
  if (!Object.prototype.hasOwnProperty.call(poolsGroup, name)) {
    const pool = new sql.ConnectionPool(configGroup);
    const close = pool.close.bind(pool);
    pool.close = (...args) => {
      delete poolsGroup[name];
      return close(...args)
    }
    await pool.connect();
    poolsGroup[name] = pool;
  }
  return poolsGroup[name];
}


export default {dbPool, dbPoolLong, dbPoolShort, dbPoolGroup};