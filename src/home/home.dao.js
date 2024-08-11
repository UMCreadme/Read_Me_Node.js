import { pool } from "../../config/db.config.js";
import { getShortsByCategory, getAllCategories, getFollowerFeed, getShort, getUserCategories, getUserRecommendedShorts } from "./home.sql.js";

// 카테고리 별 쇼츠 조회
export const getShortsbyCategory = async (category_id, offset, limit) => {
    const conn = await pool.getConnection();
    try {
        const [categoryShorts] = await conn.query(getShortsByCategory, [category_id, category_id]);
        return categoryShorts;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 비회원일 시 카테고리 리스트 반환 - 우선순위순
export const getAllCategory = async () => {
    const conn = await pool.getConnection();
    try {
        const [allCategories] = await conn.query(getAllCategories);
        return allCategories;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 회원일 시 맞춤 카테고리 리스트 반환 - 맞춤카테고리 우선 배정, 나머지 우선순위순
export const getUserCategoriesById = async(user_id) => {
    const conn = await pool.getConnection();
    try {
        const [userCategories] = await conn.query(getUserCategories, [user_id]);
        return userCategories;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 회원일 시 추천 숏츠 리스트 가져오기 - 맞춤 카테고리 내 숏츠 인기순 랜덤 1개씩 + TODO: 나중에 인기순 기준 좋아요 100개로 변경
export const getRecommendedShorts = async (user_id) => {
    const conn = await pool.getConnection();
    try {
        const [userRecommendedShorts] = await conn.query(getUserRecommendedShorts, [user_id]);
        return userRecommendedShorts;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 비회원일 시 숏츠 리스트 가져오기 - 최신순
export const getShorts = async (offset, limit) => {
    const conn = await pool.getConnection();
    try {
        const [Shorts] = await conn.query(getShort, [limit, offset]);
        return Shorts;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// 팔로잉하는 유저들의 숏츠 리스트 가져오기
export const getFollowersFeeds = async (user_id, offset, limit) => {
    if (!user_id) return [];
    const conn = await pool.getConnection();
    try {
        const [followersFeeds] = await conn.query(getFollowerFeed, [user_id, user_id, limit, offset]);
        return followersFeeds;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}
