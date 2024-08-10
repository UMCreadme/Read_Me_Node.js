import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { isUserReadBookById } from "../book/book.sql.js";
import { insertObject } from "../common/common.dao.js";
import { addComment, getShortsByAuthorKeyword, getShortsByTagKeyword, getShortsByTitleKeyword } from "./shorts.sql.js";
import { checkLike, removeLike, addLike } from "./shorts.sql.js";


// 책 제목으로 쇼츠 검색
export const getShortsToTitleKeyword = async (keyword) => {
    const conn = await pool.getConnection();
    try {
        const [shortsTitle] = await conn.query(getShortsByTitleKeyword, [keyword]);
        return shortsTitle;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 저자로 쇼츠 검색
export const getShortsToAuthorKeyword = async (keyword) => {
    const conn = await pool.getConnection();
    try {
        const [shortsAuthor] = await conn.query(getShortsByAuthorKeyword, [keyword]);
        return shortsAuthor;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 태그로 쇼츠 검색
export const getShortsToTagKeyword = async (keyword) => {
    const conn = await pool.getConnection();
    try {
        const [shortsTag] = await conn.query(getShortsByTagKeyword, [keyword]);
        return shortsTag;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 쇼츠 생성
export const createShorts = async (shorts) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('BEGIN');
        
        // 쇼츠 정보 저장
        const shortsId = await insertObject(conn, 'SHORTS', shorts);

        // 이미 읽은 책인지 확인
        const [isRead] = await conn.query(isUserReadBookById, [shorts.user_id, shorts.book_id]);
        if (isRead.length !== 0) {
            await conn.query('COMMIT');
            return shortsId;
        }

        // 아직 읽지 않은 책일 경우 책 읽음 표시
        await insertObject(conn, 'USER_BOOK', {user_id: shorts.user_id, book_id: shorts.book_id});

        await conn.query('COMMIT');
        return shortsId;
    } catch (err) {
        await conn.query('ROLLBACK');
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 쇼츠에 댓글 달기
export const addCommentDao = async (shorts_id, user_id, content) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(addComment, [shorts_id, user_id, content]);
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// shorts ID 존재 여부 확인
export const doesShortExistDao = async (shorts_id) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query('SELECT 1 FROM SHORTS WHERE shorts_id = ?', [shorts_id]);
        return result.length > 0;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 존재하는 쇼츠인지 확인
export const checkShortsExistenceDao = async (shorts_id) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT COUNT(*) as count FROM SHORTS WHERE shorts_id = ?', [shorts_id]);
        return rows[0].count > 0;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 좋아요 누른 상태인지 확인
export const checkLikeDao = async (shorts_id, user_id) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(checkLike, [shorts_id, user_id]);
        return rows[0].count > 0;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 좋아요 추가
export const addLikeDao = async (shorts_id, user_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(addLike, [shorts_id, user_id]);
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 좋아요 삭제
export const removeLikeDao = async (shorts_id, user_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(removeLike, [shorts_id, user_id]);
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 좋아요 수 조회
export const getLikeCntDao = async (shorts_id) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT COUNT(*) as count FROM LIKE_SHORTS WHERE shorts_id = ?', [shorts_id]);
        return rows[0].count;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};

// 쇼츠 소유자 확인
export const checkShortsOwnerDao = async (shorts_id) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await conn.query('SELECT user_id FROM SHORTS WHERE shorts_id = ?', [shorts_id]);
        if (result.length === 0) {
        throw new BaseError(status.SHORTS_NOT_FOUND);
        }
        return result[0].user_id;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
};



//쇼츠 삭제 - softdelete
export const deleteShortsDao = async (shorts_id) => {
    const conn = await pool.getConnection();

    try {
        await conn.query('BEGIN');

        // 쇼츠 좋아요 - Hard delete
        await conn.query('DELETE FROM LIKE_SHORTS WHERE shorts_id = ?', [shorts_id]);

        // 쇼츠 댓글 - soft delete
        await conn.query('UPDATE COMMENT SET is_deleted = 1 WHERE shorts_id = ?', [shorts_id]);

        // 쇼츠 - soft delete
        await conn.query('UPDATE SHORTS SET is_deleted = 1 WHERE shorts_id = ?', [shorts_id]);

        await conn.query('COMMIT');
    } catch (err) {
        await conn.query('ROLLBACK');
        throw err;
    } finally {
        conn.release();
    }
    
    
};