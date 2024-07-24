import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { findCategoryNameByBookId, getBookById } from "./book.sql.js";

export const findBookById = async (bookId) => {

    const conn = await pool.getConnection();
    const [book] = await pool.query(getBookById, bookId)

    conn.release();

    return book[0];
}

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