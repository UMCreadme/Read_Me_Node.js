import { pool } from "../../config/db.config.js";
import { addSearchQuery, getRecentResearchId, updateRecentSearch } from "./research.sql.js";
import { RecentSearchesDTO } from "./research.dto.js";
import { deleteSearch, SearchUser, getQueriesbyId } from "./research.sql.js";

// 검색어 추가
export const addSearchDao = async (user_id, query, book_id) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(addSearchQuery, [user_id, query, book_id ? book_id : null]);
        return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 검색어, 유저 ID에 해당하는 ID값 조회
export const getResearchId = async (user_id, query) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(getRecentResearchId, [user_id, query]);
        if (rows.length === 0) {
            return undefined;
        }
        return rows[0].recent_searches_id;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 검색어 업데이트
export const updateSearchDao = async (research_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(updateRecentSearch, [research_id]);
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 검색어에 해당하는 유저 ID 조회
export const getResearchUserId = async (research_id) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(SearchUser, [research_id]);
        return rows[0].user_id;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 검색어 삭제
export const deleteRecentSearch = async (research_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(deleteSearch, [research_id]);
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 최근 검색어 조회
export const getRecentResearch = async (user_id) => {
    const conn = await pool.getConnection();
    try {
        const [queries] = await conn.query(getQueriesbyId, [user_id]);
        return queries.map(row => new RecentSearchesDTO(row));
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};
