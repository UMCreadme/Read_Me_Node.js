import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { pool } from "../../config/db.config.js";
import { getShortsByCategory } from "./home.sql.js";

// 카테고리 별 쇼츠 조회
export const getShortsbyCategory = async (category_id, offset, limit) => {
    try {
        const conn = await pool.getConnection();
        const [categoryShorts] = await pool.query(getShortsByCategory, [category_id, limit, offset]);

        conn.release();

        return categoryShorts;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
}
