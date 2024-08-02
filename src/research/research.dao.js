import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { searchUser } from "../users/users.controller.js";
import { deleteSearch, SearchUser } from "./research.sql.js";


// 검색어 삭제
export const deleteRecentSearch = async (research_id, currentUserId) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(SearchUser, [research_id]);
    const user_id = rows[0].user_id;

    if ( user_id !== currentUserId) {
        throw new BaseError(status.UNAUTHORIZED);
    }

    // 유저 아이디가 일치할 경우, 검색어 삭제
    await conn.query(deleteSearch, [research_id]);

    conn.release();
}