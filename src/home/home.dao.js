import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { pool } from "../../config/db.config.js";
import { getShortsByCategory } from "./home.sql.js";

// 카테고리 별 쇼츠 조회
export const getShortsbyCategory = async (category_id, offset, limit) => {
    try {
        const conn = await pool.getConnection();
        const [categoryShorts] = await pool.query(getShortsByCategory, [category_id, limit, offset]);

        conn.release();

        return categoryShorts;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
}

// 비회원일 시 카테고리 리스트 반환 - 가나다순
export const getAllCategory = async () => {
    try {
        const conn = await pool.getConnection();

        let allCategories = []
        [allCategories] = await conn.query(getAllCategories);

        conn.release();
        return allCategories;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
}

// 회원일 시 맞춤 카테고리 리스트 반환 - 4개 우선 배정, 나머지 가나다순
export const getUserCategoriesById = async(user_id) => {
    try {
        const conn = await pool.getConnection();
        
        let userCategories = [];
        [userCategories] = await conn.query(getUserCategories, [user_id]);

        conn.release();
        return userCategories;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
}


// 회원일 시 추천 숏츠 리스트 가져오기 - 맞춤 카테고리 내 숏츠 최신순
export const getRecommendedShorts = async (categories, offset, limit) => {
    try {
        const conn = await pool.getConnection();

        let userRecommendedShorts = [];
        [userRecommendedShorts] = await conn.query(getUserRecommendedShorts, [categories, offset, limit]);

        conn.release();
        return userRecommendedShorts;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
}

// 비회원일 시 숏츠 리스트 가져오기 - 최신순
export const getShorts = async (offset, limit) => {
    try {
        const conn = await pool.getConnection();

        let Shorts = [];
        [Shorts] = await conn.query(getShort, [offset, limit]);

        conn.release();
        return Shorts;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
}


// 팔로잉하는 유저들의 숏츠 리스트 가져오기
export const getFollowersFeeds = async (user_id, offset, limit) => {
    if (!user_id) return [];
    try {
        const conn = await pool.getConnection();

        let followersFeeds = []
        [followersFeeds] = await conn.query(getFollowerFeed, [user_id, user_id, offset, limit]);

        conn.release();
        return followersFeeds.map(followersFeed => ({
            ...followersFeed,
            isLike: !!followersFeed.isLike // Boolean 변환
        }));
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST);
    }
    
}
