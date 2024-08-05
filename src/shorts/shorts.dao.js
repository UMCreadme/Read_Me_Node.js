import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { isUserReadBookById } from "../book/book.sql.js";
import { insertObject } from "../common/common.dao.js";
import { addComment, getShortsByAuthorKeyword, getShortsByTagKeyword, getShortsByTitleKeyword } from "./shorts.sql.js";
import { checkLike, removeLike, addLike } from "./shorts.sql.js";


// 책 제목으로 쇼츠 검색
export const getShortsToTitleKeyword = async (keyword) => {
    try {
        const conn = await pool.getConnection();
        const [shortsTitle] = await conn.query(getShortsByTitleKeyword, [keyword]);

        conn.release();

        return shortsTitle;
    } catch (err) {
        console.log(err);
        if (err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};

// 저자로 쇼츠 검색
export const getShortsToAuthorKeyword = async (keyword) => {
    try {
        const conn = await pool.getConnection();
        const [shortsAuthor] = await conn.query(getShortsByAuthorKeyword, [keyword, keyword]);

        conn.release();

        return shortsAuthor;
    } catch (err) {
        console.log(err);
        if (err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};

// 태그로 쇼츠 검색
export const getShortsToTagKeyword = async (keyword) => {
    try {
        const conn = await pool.getConnection();
        const [shortsTag] = await conn.query(getShortsByTagKeyword, [keyword]);

        conn.release();

        return shortsTag;
    } catch (err) {
        console.log(err);
        if (err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
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
            conn.release();
            return shortsId;
        }

        // 아직 읽지 않은 책일 경우 책 읽음 표시
        await insertObject(conn, 'USER_BOOK', {user_id: shorts.user_id, book_id: shorts.book_id});

        await conn.query('COMMIT');
        conn.release();

        return shortsId;
    } catch (err) {
        await conn.query('ROLLBACK');
        conn.release();

        console.log(err);
        if (err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};


// 쇼츠에 댓글 달기
export const addCommentDao = async (shorts_id, user_id, content) => {
    const conn = await pool.getConnection();
    await conn.query(addComment, [shorts_id, user_id, content]);
        
    conn.release();
}

// shorts ID 존재 여부 확인
export const doesShortExistDao = async (shorts_id) => {
    const conn = await pool.getConnection();

    const [result] = await conn.query('SELECT 1 FROM SHORTS WHERE shorts_id = ?', [shorts_id]);
    conn.release();
    return result.length > 0;
}

// 존재하는 쇼츠인 지 확인
export const checkShortsExistenceDao = async (shorts_id) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM SHORTS WHERE shorts_id = ? AND is_deleted = 0', [shorts_id]);

    conn.release();
    return rows[0].count > 0;
}

// 좋아요 누른 상태인 지 확인
export const checkLikeDao = async (shorts_id, user_id) => {
    const conn = await pool.getConnection();

    const [rows] = await conn.query(checkLike, [shorts_id, user_id]);

    conn.release();
    return rows[0].count > 0;

}

// 좋아요 추가
export const addLikeDao = async (shorts_id, user_id) => {
    const conn = await pool.getConnection();

    await conn.query(addLike, [shorts_id, user_id]);
    
    conn.release();
}

// 좋아요 삭제
export const removeLikeDao = async (shorts_id, user_id) => {
    const conn = await pool.getConnection();

    await conn.query(removeLike, [shorts_id, user_id]);

    conn.release();
}

// 좋아요 수 조회
export const getLikeCntDao = async (shorts_id) => {
    const conn = await pool.getConnection();

    const [rows] = await conn.query('SELECT COUNT(*) as count FROM LIKE_SHORTS WHERE shorts_id = ?', [shorts_id]);

    conn.release();
    return rows[0].count;
}

// 쇼츠 소유자 확인
export const checkShortsOwnerDao = async (shorts_id) => {
    const conn = await pool.getConnection();

    const [result] = await conn.query('SELECT user_id FROM SHORTS WHERE shorts_id = ?', [shorts_id]);
    if (result.length === 0) {
        throw new BaseError(status.SHORTS_NOT_FOUND);
    }
    return result[0].user_id;
};

//쇼츠 삭제 - softdelete
export const deleteShortsDao = async (shorts_id) => {
    const conn = await pool.getConnection();
    
    await conn.query('UPDATE SHORTS SET is_deleted = 1 WHERE shorts_id = ? ', [shorts_id]);
};