import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getQueriesbyId } from "./research.sql.js";

export const getRecentResearch = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [queries] = await conn.query(getQueriesbyId, [user_id]);

        conn.release();
        return queries;

    
    } catch (err) {
        console.log(err);
        if (err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
};