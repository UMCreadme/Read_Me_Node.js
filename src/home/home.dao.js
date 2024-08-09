import { pool } from "../../config/db.config.js";
import { getShortsByCategory, getAllCategories, getFollowerFeed, getShort, getUserCategories, getUserRecommendedShorts } from "./home.sql.js";

// 카테고리 별 쇼츠 조회
export const getShortsbyCategory = async (category_id, offset, limit) => {
    const conn = await pool.getConnection();
    const [categoryShorts] = await pool.query(getShortsByCategory, [category_id, category_id], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });

    return categoryShorts;
}

// 비회원일 시 카테고리 리스트 반환 - 우선순위순
export const getAllCategory = async () => {
    const conn = await pool.getConnection();
    const [allCategories] = await conn.query(getAllCategories, [], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });

    return allCategories;
}

// 회원일 시 맞춤 카테고리 리스트 반환 - 맞춤카테고리 우선 배정, 나머지 우선순위순
export const getUserCategoriesById = async(user_id) => {
    const conn = await pool.getConnection();
    
    let userCategories = [];
    [userCategories] = await conn.query(getUserCategories, [user_id], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });

    return userCategories;
}


// 회원일 시 추천 숏츠 리스트 가져오기 - 맞춤 카테고리 내 숏츠 인기순 랜덤 1개씩 + TODO: 나중에 인기순 기준 좋아요 100개로 변경
export const getRecommendedShorts = async (user_id) => {
    const conn = await pool.getConnection();

    let userRecommendedShorts = [];
    [userRecommendedShorts] = await conn.query(getUserRecommendedShorts, [user_id], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });

    return userRecommendedShorts;
}

// 비회원일 시 숏츠 리스트 가져오기 - 최신순
export const getShorts = async (offset, limit) => {
    const conn = await pool.getConnection();
    let Shorts = [];
    [Shorts] = await conn.query(getShort, [limit, offset], (err, rows) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });

    return Shorts;
}


// 팔로잉하는 유저들의 숏츠 리스트 가져오기
export const getFollowersFeeds = async (user_id, offset, limit) => {
    if (!user_id) return [];
    const conn = await pool.getConnection();

    let followersFeeds = [];
    [followersFeeds] = await conn.query(getFollowerFeed, [user_id, user_id, limit, offset], (err, rows) => {
        conn.release();
        if (err) {
            console.log(err);
            throw err;
        } else {
            return rows;
        }
    });

    return followersFeeds;
}
