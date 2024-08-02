import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { deleteSearch } from "./research.sql.js";


// 검색어 삭제
export const deleteRecentSearch = async (user_id, query) => {
    const conn = await pool.getConnection();
    await conn.query(deleteSearch, [user_id, query]);

    conn.release();
}