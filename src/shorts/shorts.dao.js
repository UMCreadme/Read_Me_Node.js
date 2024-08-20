import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { isUserReadBookById } from "../book/book.sql.js";
import { insertObject } from "../common/common.dao.js";
import * as sql from "./shorts.sql.js";

// shorts ID 존재 여부 확인
export const doesShortExistDao = async (shorts_id) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query('SELECT 1 FROM SHORTS WHERE shorts_id = ?', [shorts_id]);
        return result.length > 0;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 쇼츠 ID에 해당하는 category_id 조회
export const getShortsCategoryById = async (shortsId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.getCategoryByShortsId, [shortsId]);
        return result[0].category_id;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 카테고리에 해당하는 인기 쇼츠 개수 조회
export const countPopularShortsDetailToCategory = async (categoryId, POPULARITY_LIKE_CNT) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.countPopularShortsByCategory, [categoryId, POPULARITY_LIKE_CNT]);
        return result[0].total;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 쇼츠 ID에 해당하는 책 ID 조회
export const getBookIdByShortsId = async (shortsId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.getBookIdByShortsId, [shortsId]);
        return result[0].book_id;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 쇼츠 ID에 해당하는 유저 ID 조회
export const getUserIdByShortsId = async (shortsId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.getUserIdByShortsId, [shortsId]);
        if (result.length === 0) {
            throw new BaseError(status.SHORTS_NOT_FOUND);
        }
        return result[0].user_id;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 책 제목으로 쇼츠 검색
export const getShortsToTitleKeyword = async (keyword) => {
    const conn = await pool.getConnection();
    try {
        const [shortsTitle] = await conn.query(sql.getShortsByTitleKeyword, [keyword]);
        return shortsTitle;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 저자로 쇼츠 검색
export const getShortsToAuthorKeyword = async (keyword) => {
    const conn = await pool.getConnection();
    try {
        const [shortsAuthor] = await conn.query(sql.getShortsByAuthorKeyword, [keyword]);
        return shortsAuthor;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 태그로 쇼츠 검색
export const getShortsToTagKeyword = async (keyword) => {
    const conn = await pool.getConnection();
    try {
        const [shortsTag] = await conn.query(sql.getShortsByTagKeyword, [keyword]);
        return shortsTag;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
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
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 쇼츠에 댓글 달기
export const addCommentDao = async (shorts_id, user_id, content) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(sql.addComment, [shorts_id, user_id, content]);
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 좋아요 누른 상태인지 확인
export const checkLikeDao = async (shorts_id, user_id) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(sql.checkLike, [shorts_id, user_id]);
        return rows[0].count > 0;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 좋아요 추가
export const addLikeDao = async (shorts_id, user_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(sql.addLike, [shorts_id, user_id]);
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 좋아요 삭제
export const removeLikeDao = async (shorts_id, user_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(sql.removeLike, [shorts_id, user_id]);
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 좋아요 수 조회
export const getLikeCntDao = async (shorts_id) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT COUNT(*) as count FROM LIKE_SHORTS WHERE shorts_id = ?', [shorts_id]);
        return rows[0].count;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
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
        if(conn) conn.release();
    } 
};


// 시간 계산 함수
const calculatePassedTime = (seconds) => {
    if (seconds < 60) return `${seconds}초`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}분`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}일`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}주`;
    return `${Math.floor(seconds / 2592000)}개월`;
};

// 쇼츠 댓글 조회
export const getShortsComments = async (shorts_id, offset, limit) => {
    const conn =  await pool.getConnection();
    try {
        let query = sql.getComments;
        const params = [shorts_id];

        if (limit !== null && offset !== null) {
            query += ` LIMIT ? OFFSET ?`;
            params.push(limit, offset);
        }
        const [comments] = await conn.query(query, params);
        return comments.map(comment => ({
            userId: comment.user_id,
            account: comment.account,
            profileImg: comment.profileImg,
            content: comment.comment,
            passedDate: calculatePassedTime(comment.passedSeconds),
          }));
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
};
