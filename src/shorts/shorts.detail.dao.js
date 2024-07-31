import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { findFollowStatus } from "../users/users.sql.js";
import * as sql from "./shorts.detail.sql.js";
import { countShortsDetailByBookId, isLikeShorts } from "./shorts.sql.js";

// 쇼츠 ID로 쇼츠 상세 조회
export const getShortsDetailToShortsId = async (shortsId, userId=null) => {
    try {
        const conn = await pool.getConnection();
        const [shorts] = await conn.query(sql.getShortsDetailById, [shortsId]);

        if(userId != null) {
            const [isLike] = await conn.query(isLikeShorts, [userId, shorts[0].shorts_id]);
            const [isFollow] = await conn.query(findFollowStatus, [userId, shorts[0].user_id]);

            shorts[0].isLike = isLike;
            shorts[0].isFollow = isFollow;
        }

        conn.release();

        return shorts;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};

// 카테고리별 쇼츠 상세 조회
export const getShortsDetailToCategory = async (shortsId, category, size, offset, userId=null) => {
    try {
        const conn = await pool.getConnection();
        const [shorts] = await conn.query(sql.getShortsDetailByCategory, [category, shortsId, size, offset]);

        if(userId != null) {
            for(const short of shorts) {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            }
        }

        conn.release();

        return shorts;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};

export const getShortsDetailToBook = async (shortsId, bookId, size, offset, userId=null) => {
    try {
        const conn = await pool.getConnection();
        const [shorts] = await conn.query(sql.getShortsDetailByBook, [bookId, shortsId, size, offset]);
        
        if(userId != null) {
            for(const short of shorts) {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            }
        }

        conn.release();

        return shorts;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};

export const countShortsDetailToBook = async (bookId) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(countShortsDetailByBookId, [bookId]);
        conn.release();

        return result[0].total;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};

export const getShortsDetailToCategoryExcludeBook = async (category, bookId, size, offset, userId=null) => {
    try {
        const conn = await pool.getConnection();
        const [shorts] = await conn.query(sql.getShortsDetailByCategoryExcludeBook, [category, bookId, size, offset]);

        if(userId != null) {
            for(const short of shorts) {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            }
        }

        conn.release();

        return shorts;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};

export const getShortsDetailToUser = async (shortsId, userId, size, offset, myId=null) => {
    try {
        const conn = await pool.getConnection();
        const [shorts] = await conn.query(sql.getShortsDetailByUser, [userId, shortsId, size, offset]);

        if (myId != null) {
            for(const short of shorts) {
                const [isLike] = await conn.query(isLikeShorts, [myId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [myId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            }
        }

        conn.release();

        return shorts;
    }
    catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};

export const getShortsDetailToUserLike = async (shortsId, userId, size, offset, myId=null) => {
    try {
        const conn = await pool.getConnection();
        const [shorts] = await conn.query(sql.getShortsDetailByUserLike, [userId, userId, shortsId, size, offset]);

        if (myId != null) {
            for(const short of shorts) {
                const [isLike] = await conn.query(isLikeShorts, [myId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [myId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            }
        }

        conn.release();

        return shorts;
    }
    catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};

export const getShortsDetailToCategoryExcludeKeyword = async (category, keywordShorts, size, offset, userId=null) => {
    try {
        const conn = await pool.getConnection();

        // 키워드 값에 따라 placeholder를 생성하여 쿼리를 생성
        let shorts;
        if(keywordShorts.length === 0) {
            [shorts] = await conn.query(sql.getShortsDetailByCategory, [category, -1, size, offset]);
        } else {
            const placeholders = keywordShorts.map(() => '?').join(',');
            const query = sql.getShortsDetailByCategoryExcludeKeyword.replace('<<placeholder>>', placeholders);

            [shorts] = await conn.query(query, [category, ...keywordShorts, size, offset]);
        }

        if(userId != null) {
            for(const short of shorts) {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(findFollowStatus, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            }
        }

        conn.release();

        return shorts;
    }
    catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};
