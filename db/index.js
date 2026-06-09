const pool = require('./db');

async function executeQuery(text, params, options = {}) {
  const client = await pool.connect();
  try {
    const role = options.role || 'public';
    const userId = options.userId || '';

    await client.query('BEGIN');
    await client.query('SET LOCAL app.role = $1', [role]);
    if (userId) {
      await client.query('SET LOCAL app.user_id = $1', [userId]);
    }
    const result = await client.query(text, params);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

module.exports = pool;
module.exports.executeQuery = executeQuery;
module.exports.pool = pool;
