import { pool } from "../../config/db.config.js";
import { findFollowStatus } from "../users/users.sql.js";
import * as sql from "./shorts.detail.sql.js";
import { POPULARITY_LIKE_CNT } from "./shorts.service.js";
import { countShortsDetailByBookId, isLikeShorts } from "./shorts.sql.js";

// 쇼츠 ID로 쇼츠 상세 조회
export const getShortsDetailToShortsId = async (shortsId, userId) => {
    const conn = await pool.getConnection();
    try {
        const [shorts] = await conn.query(sql.getShortsDetailById, [shortsId]);

        if (userId != null) {
            const [isLike] = await conn.query(isLikeShorts, [userId, shorts[0].shorts_id]);
            const [isFollow] = await conn.query(findFollowStatus, [userId, shorts[0].user_id]);

            shorts[0].isLike = isLike;
            shorts[0].isFollow = isFollow;
        }

        return shorts;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 카테고리별 인기 쇼츠 상세 조회
export const getPopularShortsDetailToCategory = async (shortsId, categoryId, userId, size, offset) => {
    const conn = await pool.getConnection();
    try {
        const [shorts] = await conn.query(sql.getPopularShortsDetailByCategory, [shortsId, POPULARITY_LIKE_CNT, categoryId, size, offset]);

        if (userId != null) {
            shorts.map(async (short) => {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            });
        }
    
        return shorts;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 카테고리별 비인기 쇼츠 상세 조회
export const getShortsDetailToCategory = async (shortsId, categoryId, userId, size, offset) => {
    const conn = await pool.getConnection();
    try {
        const [shorts] = await conn.query(sql.getShortsDetailByCategory, [shortsId, POPULARITY_LIKE_CNT, categoryId, size, offset]);

        if (userId != null) {
            shorts.map(async (short) => {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [userId, short.user_id]);
                
                short.isLike = isLike;
                short.isFollow = isFollow;
            });
        }

        return shorts;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

export const getShortsDetailToBook = async (shortsId, bookId, size, offset, userId = null) => {
    const conn = await pool.getConnection();
    try {
        const [shorts] = await conn.query(sql.getShortsDetailByBook, [bookId, shortsId, size, offset]);

        if (userId != null) {
            for (const short of shorts) {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            }
        }

        return shorts;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

export const countShortsDetailToBook = async (bookId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(countShortsDetailByBookId, [bookId]);
        return result[0].total;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

export const getShortsDetailToCategoryExcludeBook = async (category, bookId, size, offset, userId = null) => {
    const conn = await pool.getConnection();
    try {
        const [shorts] = await conn.query(sql.getShortsDetailByCategoryExcludeBook, [category, bookId, size, offset]);

        if (userId != null) {
            for (const short of shorts) {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            }
        }

        return shorts;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

export const getShortsDetailToUser = async (shortsId, userId, size, offset, myId = null) => {
    const conn = await pool.getConnection();
    try {
        const [shorts] = await conn.query(sql.getShortsDetailByUser, [userId, shortsId, size, offset]);

        if (myId != null) {
            for (const short of shorts) {
                const [isLike] = await conn.query(isLikeShorts, [myId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [myId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            }
        }

        return shorts;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

export const getShortsDetailToUserLike = async (shortsId, userId, size, offset, myId = null) => {
    const conn = await pool.getConnection();
    try {
        const [shorts] = await conn.query(sql.getShortsDetailByUserLike, [userId, userId, shortsId, size, offset]);

        if (myId != null) {
            for (const short of shorts) {
                const [isLike] = await conn.query(isLikeShorts, [myId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [myId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            }
        }

        return shorts;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

export const getShortsDetailToCategoryExcludeKeyword = async (category, keywordShorts, size, offset, userId = null) => {
    const conn = await pool.getConnection();
    try {
        let shorts;
        if (keywordShorts.length === 0) {
            [shorts] = await conn.query(sql.getShortsDetailByCategory, [category, -1, size, offset]);
        } else {
            const placeholders = keywordShorts.map(() => '?').join(',');
            const query = sql.getShortsDetailByCategoryExcludeKeyword.replace('<<placeholder>>', placeholders);

            [shorts] = await conn.query(query, [category, ...keywordShorts, size, offset]);
        }

        if (userId != null) {
            for (const short of shorts) {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            }
        }

        return shorts;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};
