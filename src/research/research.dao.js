import { pool } from "../../config/db.config.js";
import { addSearchQuery } from "./research.sql.js";
import { RecentSearchesDTO } from "./research.dto.js";
import { deleteSearch, SearchUser, getQueriesbyId } from "./research.sql.js";

// 검색어 추가
export const addSearchDao = async (user_id, query, book_id) => {
    const conn = await pool.getConnection();
    const [result] = await conn.query(addSearchQuery, [user_id, query, 
        book_id ? book_id : null ], (err, rows) => {
            conn.release();
            if (err) {
                console.log(err);
                throw err;
            } else {
                return rows;
            }
        });
        
    return result[0];
};

// 검색어에 해당하는 유저 ID 조회
export const getResearchUserId = async (research_id) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(SearchUser, [research_id], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });
    return rows[0].user_id;
};

// 검색어 삭제
export const deleteRecentSearch = async (research_id) => {
    const conn = await pool.getConnection();
    await conn.query(deleteSearch, [research_id], (err) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        }
    });
};

export const getRecentResearch = async (user_id) => {
    const conn = await pool.getConnection();
    const [queries] = await conn.query(getQueriesbyId, [user_id], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });

    return queries.map(row => new RecentSearchesDTO(row));
};
