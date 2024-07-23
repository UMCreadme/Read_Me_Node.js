import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getShortsDetailByBook, getShortsDetailByCategory, getShortsDetailByCategoryExcludeBook, getShortsDetailByUser, getShortsDetailByUserLike } from "./shorts.detail.sql.js";
import { countShortsDetailByBookId, findBookById, findCategoryNameByBookId, isFollowUser, isLikeShorts } from "./shorts.sql.js";

export const getShortsDetailToCategory = async (category, size, offset, userId=null) => {
    try {
        const conn = await pool.getConnection();
        const [shorts] = await conn.query(getShortsDetailByCategory, [category, size, offset]);

        for(const short of shorts) {
            if(userId != null) {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(isFollowUser, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            } else {
                short.isLike = false;
                short.isFollow = false;
            }
        }

        conn.release();

        return shorts;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
}

export const getShortsDetailToBook = async (bookId, size, offset, userId=null) => {
    try {
        const conn = await pool.getConnection();

        const [isBook] = await conn.query(findBookById, [bookId]);
        if(isBook.length == 0) {
            conn.release();
            return [];
        }

        const [shorts] = await conn.query(getShortsDetailByBook, [bookId, size, offset]);
        for(const short of shorts) {
            if(userId != null) {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(isFollowUser, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            } else {
                short.isLike = false;
                short.isFollow = false;
            }
        }

        conn.release();

        return shorts;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
}

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
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
}

export const getShortsDetailToCategoryExcludeBook = async (category, bookId, size, offset, userId=null) => {
    try {
        const conn = await pool.getConnection();
        const [shorts] = await conn.query(getShortsDetailByCategoryExcludeBook, [category, bookId, size, offset]);

        for(const short of shorts) {
            if(userId != null) {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(isFollowUser, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            } else {
                short.isLike = false;
                short.isFollow = false;
            }
        }

        conn.release();

        return shorts;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
}

export const getShortsDetailToUser = async (userId, size, offset, myId=null) => {
    try {
        const conn = await pool.getConnection();
        const [shorts] = await conn.query(getShortsDetailByUser, [userId, size, offset]);

        for(const short of shorts) {
            if(myId != null) {
                const [isLike] = await conn.query(isLikeShorts, [myId, short.shorts_id]);
                const [isFollow] = await conn.query(isFollowUser, [myId, short.user_id]);

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
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
}

export const getShortsDetailToUserLike = async (userId, size, offset, myId=null) => {
    try {
        const conn = await pool.getConnection();
        const [shorts] = await conn.query(getShortsDetailByUserLike, [userId, size, offset]);

        for(const short of shorts) {
            if(myId != null) {
                const [isLike] = await conn.query(isLikeShorts, [myId, short.shorts_id]);
                const [isFollow] = await conn.query(isFollowUser, [myId, short.user_id]);

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
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
}

export const getShortsDetailToKeyword = async (keyword, size, offset, userId=null) => {
    try {
        const conn = await pool.getConnection();

        // TODO: 검색 dao 호출
        const searchResult = [];

        conn.release();

        return searchResult;
    }
    catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
}

export const getShortsDetailToCategoryExcludeKeyword = async (category, keywordShorts, size, offset, userId=null) => {
    try {
        const conn = await pool.getConnection();
        // TODO: 검색 기능 먼저 구현 후 개발
        const shorts = [];

        conn.release();

        return shorts;
    }
    catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
}

// TODO: book 도메인으로 옮기기
export const getBookCategory = async (bookId) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(findCategoryNameByBookId, [bookId]);
        conn.release();

        return result[0].name;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
}
