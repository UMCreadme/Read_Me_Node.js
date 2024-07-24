import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getShortsByAuthorKeyword, getShortsByTagKeyword, getShortsByTitleKeyword } from "./shorts.sql.js";

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
            throw new BaseError(status.PARAMETER_IS_WRONG);
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
            throw new BaseError(status.PARAMETER_IS_WRONG);
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
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
};
