const { Pool } = require('pg');

try {
  require('dotenv').config();
} catch (err) {
  // dotenv is optional here; if installed, it will load process.env.DATABASE_URL from .env.
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;
