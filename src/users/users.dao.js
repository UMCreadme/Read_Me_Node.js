import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { pool } from "../../config/db.config.js";
import {
    getUserReadBooksIdById,
    getUserFollowers,
    getUserFollowings,
    getUserById,
    getUserLikeShortsIdById,
    getUserShortsById,
    addFollowUser,
    cancelFollowUser,
    findFollowStatus,
    findIfContainsKeywordWithUserId,
    getEachFollowIdList,
    getMeFollowIdList,
    getMyFollowIdList,
    findAllIfContainsKeywordOrdered,
    save,
    updateRefreshToken,
    insertUserFavorite,
    getUserByUniqueIdAndEmail
} from "./users.sql.js";
import { getShortsById } from "../shorts/shorts.sql.js";
import { getBookById } from "../book/book.sql.js";

// 유저 회원가입
export const userSignUp = async (body, provider, refreshToken) => {
    try{
        const conn = await pool.getConnection();

        const [result] = await pool.query(save, [body.uniqueId, body.email, body.account, body.nickname, provider, refreshToken])
        const [newUser] = await pool.query(getUserById, result.insertId)

        const userFavoriteIdList = body.categoryIdList

        for (const userFavoriteIdListElement of userFavoriteIdList) {
            await pool.query(insertUserFavorite, [newUser[0].user_id, userFavoriteIdListElement])
        }

        conn.release()
        return newUser[0];
    }
    catch (err){
        throw new BaseError(status.BAD_REQUEST)
    }
}

// 이미 존재하는 유저가 다시 로그인
export const userLogin = async (body, provider, refreshToken) => {

    try{
        const conn = await pool.getConnection();
        const [user] = await pool.query(getUserByUniqueIdAndEmail, [body.uniqueId, body.email])

        if(user[0] === undefined){
            return null
        }

        const realUserId = user[0].user_id
        await pool.query(updateRefreshToken, [refreshToken, realUserId])

        conn.release()
        return user[0]
    }

    catch (err){
        throw new BaseError(status.BAD_REQUEST)
    }
}

// 유저 정보 조회
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

// 다른 유저 정보 조회시 필요한 팔로우 여부 -- feat/13번이랑 충돌날거라 머지 후 수정 예정
export const checkIsFollowed = async (myId, userId) => {
    const conn = await pool.getConnection();
    if (myId === null) {
        return false;
    }
    
    try {
        const [followStatus] = await conn.query(findFollowStatus, [myId, userId]);
        return followStatus.length > 0;
    } finally {
        conn.release();
    }
}

// 유저가 만든 쇼츠 리스트 조회
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

// 유저가 찜한 쇼츠 리스트 조회
export const findUserLikeShortsById = async(userId, offset, limit) => {

    try{
        const conn = await pool.getConnection();
        const [userLikeShortsIdList] = await pool.query(getUserLikeShortsIdById, [userId, limit, offset]);
        const userLikeShorts =[]

        for (const userLikeShortsId of userLikeShortsIdList) {
            let [userLikeShort] = await pool.query(getShortsById,userLikeShortsId.shorts_id)
            userLikeShorts.push(userLikeShort[0])
        }

        conn.release();
        return userLikeShorts;
    }
    catch (err) {
        throw new BaseError(status.BAD_REQUEST);
    }

}

// 유저가 읽은 책 리스트 조회
export const findUserBooksById = async(userId, offset, limit) => {
    try{
        const conn = await pool.getConnection();
        const [userBooksIdList] = await pool.query(getUserReadBooksIdById, [userId, limit, offset])
        const userBooks = []

        for (const userBooksId of userBooksIdList) {
            let [userBook] = await pool.query(getBookById, userBooksId.book_id)
            userBooks.push(userBook[0])
        }

        conn.release();
        return userBooks;
    }
    catch(err){
        throw new BaseError(status.BAD_REQUEST)
    }
}

// 유저(본인)가 다른 유저 팔로잉
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

// 유저(본인)가 다른 유저 팔로우 취소
export const followUserCancel = async(userId, unfollowUserId) => {

    try{
        const conn = await pool.getConnection();

        // 현재 팔로우 상태 확인
        const isFollowing = await checkIsFollowed(userId, unfollowUserId);
        if (!isFollowing) {
            throw new BaseError(status.BAD_REQUEST, "현재 팔로우 상태가 아닙니다.");
        }

         // 팔로우 취소 쿼리 실행
        await conn.query(cancelFollowUser, [userId, unfollowUserId]);
        conn.release();

         return true; // 팔로우 취소 성공
    }
    catch (err){
        throw new BaseError(status.BAD_REQUEST)
    }
}

// 키워드 검색으로 조회되는 나를 찾기
export const findMeWithKeyword = async(userId, keyword) =>{
    try{
        const conn = await pool.getConnection();
        const [findMeByAccount] = await pool.query(findIfContainsKeywordWithUserId, [userId, 'account', keyword]);
        const [findMeByNickname] = await pool.query(findIfContainsKeywordWithUserId, [userId, 'nickname', keyword]);

        conn.release()

        return findMeByAccount[0] || findMeByNickname[0] || null;

    }
    catch (err){

    }
}

// 키워드 검색으로 조회되는 유저중 맞팔로우 되어있는 사람 찾기
export const findEachFollowWithKeyword = async(userId, keyword, target) =>{
    try{
        const conn = await pool.getConnection();
        const [eachFollowIdList] = await pool.query(getEachFollowIdList, [userId, userId]);
        const resultList = []

        for (const eachFollowUserId of eachFollowIdList) {
            const [resultUser] = await pool.query(findIfContainsKeywordWithUserId,[eachFollowUserId.follower, target, keyword])
            if(resultUser[0]){
                resultList.push(resultUser[0])
            }
        }

        conn.release()

        return resultList

    }
    catch (err){
        throw new BaseError(status.BAD_REQUEST)
    }
}

// 키워드 검색으로 조회되는 유저중 맞팔로우가 아닌 본인이 팔로우 하는 사람 찾기
export const findMyFollowWithKeyword = async(userId, keyword, target)=>{
    try{
        const conn = await pool.getConnection();
        const [myFollowIdList] = await pool.query(getMyFollowIdList, [userId, userId])
        const resultList = []

        for (const myFollowUserId of myFollowIdList) {
            const [resultUser] = await pool.query(findIfContainsKeywordWithUserId,[myFollowUserId.user_id, target, keyword])
            if(resultUser[0]){
                resultList.push(resultUser[0])
            }
        }

        conn.release();

        return resultList

    }
    catch (err){
        throw new BaseError(status.BAD_REQUEST)
    }
}

// 키워드 검색으로 조회되는 유저중 맞팔로우가 아닌 나를 팔로우 하는 사람 찾기
export const findMeFollowWithKeyword = async (userId, keyword, target) => {
    try{
        const conn = await pool.getConnection()
        const [meFollowIdList] = await pool.query(getMeFollowIdList, [userId, userId])
        const resultList = []

        for (const meFollowUserId of meFollowIdList) {
            const [resultUser] = await pool.query(findIfContainsKeywordWithUserId,[meFollowUserId.follower, target, keyword])
            if(resultUser[0]){
                resultList.push(resultUser[0])
            }
        }

        conn.release();

        return resultList

    }
    catch (err){
       throw new BaseError(status.BAD_REQUEST)
    }
}

// 키워드에 해당하는 모든 유저 찾기 (팔로워 많은 순으로)
export const findUsersWithKeyword = async (userId, keyword, target) => {
    const conn = await pool.getConnection()
    const [allFindWithKeyword] = await pool.query(findAllIfContainsKeywordOrdered,[target, keyword])

    conn.release()

    return allFindWithKeyword;
}