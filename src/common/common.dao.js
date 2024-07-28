export const insertObject = async (conn, table, object) => {
    const keys = Object.keys(object);
    const values = Object.values(object);

    const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(',')})`;
    console.log('insert query: ', query);
    console.log('values: ', values);

    const [result] = await conn.query(query, values);
    console.log('insert result: ', result);

    return result.insertId;
};
