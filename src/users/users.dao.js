import {BaseError} from "../../config/error.js";
import {status} from "../../config/response.status.js";
import {pool} from "../../config/db.config.js";
import {
    getUserReadBooksIdById,
    getUserFollowers,
    getUserFollowings,
    getUserById,
    getUserLikeShortsIdById,
    getUserShortsById,
    getImageById, addFollowUser, findFollowStatus
} from "./users.sql.js";
import {getShortsById} from "../shorts/shorts.sql.js";
import {getBookById} from "../book/book.sql.js";


/**
* 유저 정보 조회
* */
export const findById = async (userId) => {
    try {
        const conn = await pool.getConnection();
        const [user] = await pool.query(getUserById, userId);

        if(user.length === 0){
            return -1;
        }

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

/**
 * 유저가 읽은 책 리스트 조회
 * */
export const findUserBooksById = async(userId, offset, limit) => {
    try{
        const conn = await pool.getConnection();
        const [userBooksIdList] = await pool.query(getUserReadBooksIdById, [userId, limit, offset])
        const userBooks = []

        for (const userBooksId of userBooksIdList) {
            let [userBook] = await pool.query(getBookById, userBooksId.book_id)
            userBooks.push(userBook[0])
        }

        return userBooks;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST)
    }
}


/**
 *  이미지 아이디로 이미지 찾기 이후에 다른 도메인으로 수정할 필요가 있을듯..?
 *  */
export const findImageById = async(imageId) => {
    try{
        const conn = await pool.getConnection();
        const [image] = await pool.query(getImageById, imageId)

        return image[0]
    }

    catch (err) {
        throw new BaseError(status.BAD_REQUEST)
    }
}


/**
 * 유저(본인)가 다른 유저 팔로잉
 */
export const followUserAdd = async(userId, followingId) => {

    try{
        const conn = await pool.getConnection();

        const [followStatus] = await pool.query(findFollowStatus, [userId, followingId])


        // 기존에 팔로우한 내역이 있으면 또 팔로우 할수 없게 만드는 로직, 중복 제거 + 본인이 본인을 팔로우하려는 경우 제거
        if(followStatus[0] || (followingId === userId)){
           return false
        }

        await pool.query(addFollowUser, [userId, followingId]);
        conn.release();

        return true
    }
    catch (err){
        throw new BaseError(status.BAD_REQUEST)
    }


}