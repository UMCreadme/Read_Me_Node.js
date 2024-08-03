import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { addSearchQuery } from "./research.sql.js";
import { RecentSearchesDTO } from "./research.dto.js";
import { deleteSearch, SearchUser, getQueriesbyId } from "./research.sql.js";

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
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};


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
}



export const getRecentResearch = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [queries] = await conn.query(getQueriesbyId, [user_id]);

        conn.release();
        return queries.map(row => new RecentSearchesDTO(row));

    
    } catch (err) {
        console.log(err);
        if (err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
}


