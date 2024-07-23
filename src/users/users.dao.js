import express from "express";
import {BaseError} from "../../config/error.js";
import {status} from "../../config/response.status.js";
import {pool} from "../../config/db.config.js";
import {getUserReadBooksIdById, getUserFollowers, getUserFollowings, getUserById, getUserLikeShortsIdById, getUserShortsById} from "./users.sql.js";
import {getShortsById} from "../shorts/shorts.sql.js";
import {getBookById} from "../book/book.sql.js";


/**
* 유저 정보 조회
* */
export const findById = async (userId) => {
    try {
        const conn = await pool.getConnection();
        const [user] = await pool.query(getUserById, userId);

        conn.release();
        return user[0];

    } catch (err) {
        throw new BaseError(status.BAD_REQUEST);
    }
}

// 유저 정보 조회시 필요한 팔로잉수
export const findFollowingNumByUserId = async (userId) => {

    try {
        const conn = await pool.getConnection();
        const [followings] = await pool.query(getUserFollowings, userId)

        conn.release();

        return followings.length;
    }
    catch (err) {
        throw new BaseError(status.BAD_REQUEST)
    }

}

// 유저 정보 조회시 필요한 팔로워 수
export const findFollowerNumByUserId = async (userId) => {
    try{
        const conn = await pool.getConnection();
        const [followers] = await pool.query(getUserFollowers, userId)
        conn.release();

        return followers.length;
    }
    catch (err) {
        throw new BaseError(status.BAD_REQUEST)
    }
}


/**
* 유저가 만든 쇼츠 리스트 조회
 * */

export const findUserShortsById = async (userId, offset ,limit) => {

    try {
        const conn = await pool.getConnection();
        const [user] = await pool.query(getUserById, userId);
        const [userShorts] = await pool.query(getUserShortsById, [userId, limit, offset]);


        conn.release();

        return userShorts;

    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }

}


/**
 * 유저가 찜한 쇼츠 리스트 조회
 */
export const findUserLikeShortsById = async(userId, offset, limit) => {

    try{
        const conn = await pool.getConnection();
        const [userLikeShortsIdList] = await pool.query(getUserLikeShortsIdById, [userId, limit, offset]);
        const userLikeShorts =[]

        for (const userLikeShortsId of userLikeShortsIdList) {
            let [userLikeShort] = await pool.query(getShortsById,userLikeShortsId.shorts_id)
            userLikeShorts.push(userLikeShort[0])
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