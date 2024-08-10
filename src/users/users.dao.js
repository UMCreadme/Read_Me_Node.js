import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { pool } from "../../config/db.config.js";
import * as sql from "./users.sql.js";
import { getShortsById } from "../shorts/shorts.sql.js";
import { getBookById } from "../book/book.sql.js";

// 유저 회원가입
export const userSignUp = async (body, provider, refreshToken) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.query(sql.save, [body.uniqueId, body.email, body.account, body.nickname, provider, refreshToken]);
        const [newUser] = await conn.query(sql.getUserById, result.insertId);

        const userFavoriteIdList = body.categoryIdList;

        for (const userFavoriteIdListElement of userFavoriteIdList) {
            await conn.query(sql.insertUserFavorite, [newUser[0].user_id, userFavoriteIdListElement]);
        }

        await conn.commit();
        return newUser[0];
    } catch (err) {
        await conn.rollback();
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 이미 존재하는 유저가 다시 로그인
export const userLogin = async (body, provider, refreshToken) => {
    const conn = await pool.getConnection();
    try {
        const [user] = await conn.query(sql.getUserByUniqueIdAndEmail, [body.uniqueId, body.email]);

        if(user[0] === undefined){
            return null;
        }

        const realUserId = user[0].user_id;
        await conn.query(sql.updateRefreshToken, [refreshToken, realUserId]);

        return user[0];
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 유저 정보 조회
export const findById = async (userId) => {
    const conn = await pool.getConnection();
    try {
        const [user] = await conn.query(sql.getUserById, userId);

        if(user.length === 0){
            return -1;
        }

        return user[0];
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 유저 정보 조회시 필요한 팔로잉수
export const findFollowingNumByUserId = async (userId) => {
    const conn = await pool.getConnection();
    try {
        const [followings] = await conn.query(sql.getUserFollowings, userId);
        return followings.length;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 유저 정보 조회시 필요한 팔로워 수
export const findFollowerNumByUserId = async (userId) => {
    const conn = await pool.getConnection();
    try {
        const [followers] = await conn.query(sql.getUserFollowers, userId);
        return followers.length;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 유저 정보 조회시 필요한 24h 이내 게시물 게시 여부
export const hasRecentPostForUser = async (userId) => {
    const conn = await pool.getConnection();
    try {
        const [recent] = await conn.query(sql.getLatestPostCount, [userId]);
        return recent[0].count > 0; // 24시간 이내 게시된 게시물 수가 0개 초과인지 반환
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 다른 유저 정보 조회시 필요한 팔로우 여부
export const checkIsFollowed = async (myId, userId) => {
    if (myId === null) {
        return false;
    }

    const conn = await pool.getConnection();
    try {
        const [followStatus] = await conn.query(sql.findFollowStatus, [myId, userId]);
        return followStatus.length > 0;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 유저가 만든 쇼츠 리스트 조회
export const findUserShortsById = async (userId, offset, limit) => {
    const conn = await pool.getConnection();
    try {
        const [userShorts] = await conn.query(sql.getUserShortsById, [userId, limit, offset]);
        return userShorts;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 유저가 찜한 쇼츠 리스트 조회
export const findUserLikeShortsById = async(userId, offset, limit) => {
    const conn = await pool.getConnection();
    try {
        const [userLikeShortsIdList] = await conn.query(sql.getUserLikeShortsIdById, [userId, limit, offset]);
        const userLikeShorts = []

        for (const userLikeShortsId of userLikeShortsIdList) {
            let [userLikeShort] = await conn.query(getShortsById,userLikeShortsId.shorts_id);
            userLikeShorts.push(userLikeShort[0]);
        }

        return userLikeShorts;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 유저가 읽은 책 리스트 조회 (페이지네이션)
export const findUserBooksById = async(userId, offset, limit) => {
    const conn = await pool.getConnection();
    try {
        const [userBooksIdList] = await conn.query(sql.getUserReadBooksIdById, [userId, limit, offset]);
        const userBooks = []

        for (const userBooksId of userBooksIdList) {
            let [userBook] = await conn.query(getBookById, userBooksId.book_id);
            userBooks.push(userBook[0]);
        }

        return userBooks;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 유저가 읽은 책 권수 조회
export const findUserBooksCountById = async(userId) => {
    const conn = await pool.getConnection();
    try {
        const [userBooksIdList] = await conn.query(sql.getUserReadBooksByUserId, [userId]);
        return userBooksIdList.length;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 유저(본인)가 다른 유저 팔로잉
export const followUserAdd = async(userId, followingId) => {
    const conn = await pool.getConnection();
    try {
        const [followStatus] = await conn.query(sql.findFollowStatus, [userId, followingId]);

        // 기존에 팔로우한 내역이 있으면 또 팔로우 할수 없게 만드는 로직, 중복 제거 + 본인이 본인을 팔로우하려는 경우 제거
        if(followStatus[0] || (followingId === userId)){
           return false;
        }

        await conn.query(sql.addFollowUser, [userId, followingId]);
        return true;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 유저(본인)가 다른 유저 팔로우 취소
export const followUserCancel = async(userId, unfollowUserId) => {
    const conn = await pool.getConnection();
    try {
        // 팔로우 취소 쿼리 실행
        await conn.query(sql.cancelFollowUser, [userId, unfollowUserId]);
        return true; // 팔로우 취소 성공
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 키워드 검색으로 조회되는 나를 찾기
export const findMeWithKeyword = async(userId, keyword) =>{
    const conn = await pool.getConnection();
    try {
        const [findMeByAccount] = await conn.query(sql.findIfContainsKeywordWithUserId, [userId, 'account', keyword]);
        const [findMeByNickname] = await conn.query(sql.findIfContainsKeywordWithUserId, [userId, 'nickname', keyword]);
        return findMeByAccount[0] || findMeByNickname[0] || null;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 키워드 검색으로 조회되는 유저중 맞팔로우 되어있는 사람 찾기
export const findEachFollowWithKeyword = async(userId, keyword, target) =>{
    const conn = await pool.getConnection();
    try {
        const [eachFollowIdList] = await conn.query(sql.getEachFollowIdList, [userId, userId]);
        const resultList = [];

        for (const eachFollowUserId of eachFollowIdList) {
            const [resultUser] = await conn.query(sql.findIfContainsKeywordWithUserId,[eachFollowUserId.follower, target, keyword]);
            if(resultUser[0]){
                resultList.push(resultUser[0]);
            }
        }

        return resultList;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 키워드 검색으로 조회되는 유저중 맞팔로우가 아닌 본인이 팔로우 하는 사람 찾기
export const findMyFollowWithKeyword = async(userId, keyword, target) => {
    const conn = await pool.getConnection();
    try {
        const [myFollowIdList] = await conn.query(sql.getMyFollowIdList, [userId, userId]);
        const resultList = [];

        for (const myFollowUserId of myFollowIdList) {
            const [resultUser] = await conn.query(sql.findIfContainsKeywordWithUserId,[myFollowUserId.user_id, target, keyword]);
            if(resultUser[0]){
                resultList.push(resultUser[0]);
            }
        }

        return resultList;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 키워드 검색으로 조회되는 유저중 맞팔로우가 아닌 나를 팔로우 하는 사람 찾기
export const findMeFollowWithKeyword = async (userId, keyword, target) => {
    const conn = await pool.getConnection();
    try {
        const [meFollowIdList] = await conn.query(sql.getMeFollowIdList, [userId, userId]);
        const resultList = [];

        for (const meFollowUserId of meFollowIdList) {
            const [resultUser] = await conn.query(sql.findIfContainsKeywordWithUserId,[meFollowUserId.follower, target, keyword]);
            if(resultUser[0]){
                resultList.push(resultUser[0]);
            }
        }

        return resultList;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

// 키워드에 해당하는 모든 유저 찾기 (팔로워 많은 순으로)
export const findUsersWithKeyword = async (userId, keyword, target) => {
    const conn = await pool.getConnection();
    try {
        const [allFindWithKeyword] = await conn.query(sql.findAllIfContainsKeywordOrdered,[target, keyword]);
        return allFindWithKeyword;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

export const checkDuplicateAccount = async(account) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT COUNT(*) as count FROM USERS WHERE account = ?', [account]);
        return rows[0].count > 0;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}

export const changeCategoryDao = async (user_id, category) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // 기존 카테고리 삭제
        await conn.query('DELETE FROM USER_FAVORITE WHERE user_id = ?', [user_id]);

        // 새로운 카테고리 삽입
        const insertValues = category.map(catId => [user_id, catId]);
        const insertCategoryQuery = 'INSERT INTO USER_FAVORITE (user_id, category_id) VALUES ?';
        await conn.query(insertCategoryQuery, [insertValues]);

        // 트랜잭션 커밋
        await conn.commit();

        // 업데이트된 카테고리 리스트 반환
        const [rows] = await conn.query('SELECT category_id FROM USER_FAVORITE WHERE user_id = ? ORDER BY category_id;', [user_id]);
        const result = rows.map(row => row.category_id);
        return result.join(',');
    } catch(error) {
        console.error('Error in changeCategoryDao:', error); // 에러 로그 추가
        await conn.rollback();
        throw error;
    } finally {
        if(conn) conn.release();
    }
}


// 유저 프로필 편집 기능
export const updateUserImageDao = async (userId, profileImg) => {
    const conn = await pool.getConnection()
    try{
        await conn.query(sql.updateUserImageSql, [profileImg, userId])
    }
    catch(err){
        console.log(err)
    }
    finally {
        if(conn) conn.release()
    }
}

// 유저 프로필 이미지 삭제 기능
export const deleteUserImageDao = async (userId) => {
    const conn = await pool.getConnection()
    try{
        await conn.query(sql.deleteUserImageSql, [userId])
    }
    catch (err) {
        console.log(err)
    }
    finally {
        if(conn) conn.release()
    }
}

// 유저 프로필 내용 수정 기능
export const updateUserInfoDao = async(userId, userData) => {
    const conn = await pool.getConnection()
    try{
        await conn.query(sql.updateUserInfoSql, [userData.nickname, userData.account, userData.comment, userId])
    }
    catch (err) {
        console.log(err)
    }
    finally {
        if(conn) conn.release()
    }
}