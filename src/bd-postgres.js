const { Pool } = require("pg");

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'clima_tempo_noticias'
  });

  module.exports = pool;