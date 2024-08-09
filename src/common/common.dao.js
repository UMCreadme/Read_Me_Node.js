export const insertObject = async (conn, table, object) => {
    const keys = Object.keys(object);
    const values = Object.values(object);
    let query;

    if (table === 'BOOK') {
        query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(',')})
        ON DUPLICATE KEY UPDATE ISBN = VALUES(ISBN), updated_at = CURRENT_TIMESTAMP;`;
    } else {
        query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(',')})`;
    }

    console.log('insert query: ', query);
    console.log('values: ', values);

    try {
        const [result] = await conn.query(query, values);
        return result.insertId;
    } catch (err) {
        console.log('insert error: ', err);
        throw err;
    }
};
