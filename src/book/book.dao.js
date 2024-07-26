import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { insertObject } from "../common/common.dao.js";
import { findBookIdByISBN, findCategoryIdByName, findCategoryNameByBookId, getBookById } from "./book.sql.js";

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
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
}

export const getBookIdByISBN = async (ISBN) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(findBookIdByISBN, [ISBN]);
        conn.release();

        if(result.length === 0) {
            return undefined;
        }

        return result[0].book_id;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
}

export const getCategoryIdByName = async (category) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(findCategoryIdByName, [category]);
        conn.release();

        if(result.length === 0) {
            return undefined;
        }

        return result[0].category_id;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
}

export const createBook = async (book) => {
    try {
        const conn = await pool.getConnection();
        const result = await insertObject(conn, 'BOOK', book);
        conn.release();

        return result;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
}
