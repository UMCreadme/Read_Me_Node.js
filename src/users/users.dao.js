import express from "express";
import {BaseError} from "../../config/error.js";
import {status} from "../../config/response.status.js";
import {pool} from "../../config/db.config.js";
import {getUserReadBooksIdById, getUserById, getUserLikeShortsIdById, getUserShortsById} from "./users.sql.js";
import {getShortsById} from "../shorts/shorts.sql.js";
import {getBookById} from "../book/book.sql.js";

// 유저 정보 조회
export const findById = async (userId) => {
    try {
        const conn = await pool.getConnection();
        const [user] = await pool.query(getUserById, userId);

        conn.release();
        return user;

    } catch (err) {
        throw new BaseError(status.BAD_REQUEST);
    }
}


// 유저가 만든 쇼츠 리스트 조회
export const findUserShortsById = async (userId) => {

    try {
        const conn = await pool.getConnection();
        const [userShorts] = await pool.query(getUserShortsById, userId);

        conn.release();

        return userShorts;

    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }

}


// 유저가 찜한 쇼츠 리스트 조회
export const findUserLikeShortsById = async(userId) => {

    try{
        const conn = await pool.getConnection();
        const [userLikeShortsIdList] = await pool.query(getUserLikeShortsIdById, userId);
        const userLikeShorts =[]

        for (const userLikeShortsId of userLikeShortsIdList) {
            let userLikeShort = await pool.query(getShortsById,userLikeShortsId)
            userLikeShorts.push(userLikeShort)
        }

        return userLikeShorts;
    }
    catch (err) {
        throw new BaseError(status.BAD_REQUEST);
    }

}


export const findUserBooksById = async(userId) => {
    try{
        const conn = await pool.getConnection();
        const [userBooksIdList] = await pool.query(getUserReadBooksIdById, userId)
        const userBooks = []

        for (const userBooksId of userBooksIdList) {
            let userBook = await pool.query(getBookById, userBooksId)
            userBooks.push(userBook)
        }

        return userBooks;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST)
    }
}