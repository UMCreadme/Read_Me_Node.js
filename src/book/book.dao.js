import { pool } from "../../config/db.config.js";
import { insertObject } from "../common/common.dao.js";
import * as sql from "./book.sql.js";

// bookId로 책 정보 조회
export const findBookById = async (bookId) => {
    const conn = await pool.getConnection();
    const [result] =  await conn.query(sql.getBookById, bookId, (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });

    return result[0];
}

// 책 ID로 카테고리 조회
export const getBookCategory = async (bookId) => {
    const conn = await pool.getConnection();
    const [result] = await conn.query(sql.findCategoryNameByBookId, [bookId], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });

    return result[0].name;
}

// ISBN으로 책 ID 조회
export const getBookIdByISBN = async (ISBN) => {
    const conn = await pool.getConnection();
    const [result] =  await conn.query(sql.findBookIdByISBN, [ISBN], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });
    return result[0].book_id;
}

// 카테고리 이름으로 카테고리 ID 조회
export const getCategoryIdByName = async (category) => {
    const conn = await pool.getConnection();
    const [result] = await conn.query(sql.findCategoryIdByName, [category], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else if(rows.length === 0) {
            return undefined;
        } else {
            return rows;
        }
    });

    return result[0].category_id;
}

// 알라딘 카테고리 cid로 category_id 조회
export const getCategoryIdByAladinCid = async (cid) => {
    const conn = await pool.getConnection();
    const [result] = await conn.query(sql.findCategoryIdByAladinCid, [cid], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });

    if(result.length === 0) {
        return undefined;
    } 

    return result[0].category_id;
}

// 책 생성
export const createBook = async (book) => {
    const conn = await pool.getConnection();
    const result = await insertObject(conn, 'BOOK', book);

    return result;
}

// 유저가 책을 읽었는지 확인
export const checkIsReadById = async (userId, bookId) => {
    const conn = await pool.getConnection();
    const [result] = await conn.query(sql.isUserReadBookById, [userId, bookId], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });

    return result.length !== 0;
}

// 책 읽음 여부 업데이트
export const updateBookIsReadToUser = async (userId, bookId) => {
    const conn = await pool.getConnection();
    await conn.query(sql.updateUserBook, [userId, bookId], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        }
    });
}

// 책 읽음 여부 삭제
export const deleteBookIsReadToUser = async (userId, bookId) => {
    const conn = await pool.getConnection();
    await conn.query(sql.deleteUserBook, [userId, bookId], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        }
    });
};

export const findUserRecentBookList = async (userId, offset, limit) => {
    const conn = await pool.getConnection()
    const [userRecentBookList] = await conn.query(sql.getUserRecentBookList, [userId, limit, offset], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    })

    const uniqueBookList = [];
    const bookIdSet = new Set();

    for (const book of userRecentBookList) {
        if (!bookIdSet.has(book.book_id)) {
            bookIdSet.add(book.book_id);
            uniqueBookList.push(book);
        }
    }

    return uniqueBookList;
}
