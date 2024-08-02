import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { addSearchQuery } from "./research.sql.js";

export const addSearchDao = async (user_id, query, book_id) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(addSearchQuery, [user_id, query, 
            book_id ? book_id : null ]);
            
        conn.release();
        return result[0];
    } catch (err) {
        if (err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
};