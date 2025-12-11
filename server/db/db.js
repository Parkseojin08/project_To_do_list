const { Pool } = require('pg');
require('dotenv').config()
const pool = new Pool({
  user: process.env.DB_NAME, // 이름
  host: process.env.DB_HOST, // 주소
  database: process.env.DB_DATABASE, // db 이름
  password: process.env.DB_PASSWORD, // 비번
  port: 5432, //포트 번호
});

module.exports = pool;
