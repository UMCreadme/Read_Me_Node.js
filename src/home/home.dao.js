import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { pool } from "../../config/db.config.js";
import { getShortsByCategory, getUserById,findIslike, getLikecount, getCommentcount } from "./home.sql.js";

// 카테고리 별 쇼츠 조회
export const findShortsByCategory = async (category, offset, limit) => {
    try {
        const conn = await pool.getConnection();
        const [categoryShorts] = await pool.query(getShortsByCategory, [category, limit, offset]);

        conn.release();

        return categoryShorts;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
}

// 유저 정보 조회
export const findUserById = async (userId) => {
    try {
        const conn = await pool.getConnection();
        const [user] = await pool.query(getUserById, [userId]);

        if(user.length === 0){
            return null;
        }

        conn.release();
        return user[0];

    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
}

// 쇼츠 아이디로 유저가 좋아요 눌렀는지 여부 
export const findShortsisLike = async (userId, shortsId) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await pool.query(findIslike, [userId, shortsId]);

        conn.release();
        return rows[0].isLiked === 1;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
}

// 쇼츠 아이디로 쇼츠 좋아요 개수 조회
export const findLikeCount = async(shortsId) => {
    try {
        const conn = await pool.getConnection();
        const [likeCnt] = await pool.query(getLikecount, [shortsId]);

        conn.release();
        return likeCnt[0].likeCount;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
}

// 쇼츠 아이디로 쇼츠 댓글 개수 조회
export const findCommentCount = async(shortsId) => {
    try {
        const conn = await pool.getConnection();
        const [commentCnt] = await pool.query(getCommentcount, [shortsId]);

        conn.release();
        return commentCnt[0].commentCount;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
}
