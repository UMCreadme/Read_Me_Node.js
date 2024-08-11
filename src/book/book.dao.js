import { pool } from "../../config/db.config.js";
import { insertObject } from "../common/common.dao.js";
import * as sql from "./book.sql.js";

// bookId로 책 정보 조회
export const findBookById = async (bookId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.getBookById, bookId);
        return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 책 ID로 카테고리 조회
export const getBookCategory = async (bookId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.findCategoryNameByBookId, [bookId]);
        return result[0].name;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// ISBN으로 책 ID 조회
export const getBookIdByISBN = async (ISBN) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.findBookIdByISBN, [ISBN]);
        if (result.length === 0) {
            return undefined;
        }
        return result[0].book_id;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 카테고리 이름으로 카테고리 ID 조회
export const getCategoryIdByName = async (category) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.findCategoryIdByName, [category]);
        if (result.length === 0) {
            return undefined;
        }
        return result[0].category_id;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 알라딘 카테고리 cid로 category_id 조회
export const getCategoryIdByAladinCid = async (cid) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.findCategoryIdByAladinCid, [cid]);
        if (result.length === 0) {
            return undefined;
        }
        return result[0].category_id;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 책 생성
export const saveBook = async (book) => {
    const conn = await pool.getConnection();
    try {
        const result = await insertObject(conn, 'BOOK', book);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 유저가 책을 읽었는지 확인
export const checkIsReadById = async (userId, bookId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.isUserReadBookById, [userId, bookId]);
        return result.length !== 0;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 책 읽음 여부 업데이트
export const updateBookIsReadToUser = async (userId, bookId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(sql.updateUserBook, [userId, bookId]);
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 책 읽음 여부 삭제
export const deleteBookIsReadToUser = async (userId, bookId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(sql.deleteUserBook, [userId, bookId]);
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

export const findUserRecentBookList = async (userId, offset, limit) => {
    const conn = await pool.getConnection();
    try {
        const [userRecentBookList] = await conn.query(sql.getUserRecentBookList, [userId, limit, offset]);
        const uniqueBookList = [];
        const bookIdSet = new Set();

        for (const book of userRecentBookList) {
            if (!bookIdSet.has(book.book_id)) {
                bookIdSet.add(book.book_id);
                uniqueBookList.push(book);
            }
        }

        return uniqueBookList;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}
