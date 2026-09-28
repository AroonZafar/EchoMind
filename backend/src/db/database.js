const { Pool } = require('pg');
const path = require('path');

try {
  require('dotenv').config({
    path: path.resolve(__dirname, '../../../.env')
  });
} catch (err) {
  // dotenv is optional here.
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;
