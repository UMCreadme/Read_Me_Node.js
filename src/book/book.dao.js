import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { insertObject } from "../common/common.dao.js";
import { findBookIdByISBN, findCategoryIdByName, findCategoryNameByBookId, getBookById, isUserReadBookById, getUserRecentBookList } from "./book.sql.js";

// bookId로 책 정보 조회
export const findBookById = async (bookId) => {

    const conn = await pool.getConnection();
    const [book] = await pool.query(getBookById, bookId)

    conn.release();

    return book[0];
}

// 책 ID로 카테고리 조회
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

// ISBN으로 책 ID 조회
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

// 카테고리 이름으로 카테고리 ID 조회
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

// 책 생성
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

// 유저가 책을 읽었는지 확인
export const findIsReadById = async (userId, bookId) => {
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(isUserReadBookById, [userId, bookId]);
        conn.release();

        return result.length !== 0;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
}

export const findUserRecentBookList = async (userId, offset, limit) => {
    try {
        const conn = await pool.getConnection()
        const [userRecentBookList] = await pool.query(getUserRecentBookList, [userId, limit, offset])

        const uniqueBookList = [];
        const bookIdSet = new Set();

        for (const book of userRecentBookList) {
            if (!bookIdSet.has(book.book_id)) {
                bookIdSet.add(book.book_id);
                uniqueBookList.push(book);
            }
        }

        conn.release()
        return uniqueBookList;
    }
    catch (err){
        throw new BaseError(status.INTERNAL_SERVER_ERROR)
    }
}
