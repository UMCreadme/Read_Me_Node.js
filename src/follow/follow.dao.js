import {pool} from "../../config/db.config.js";
import {getUserFollowers, getUserFollowings} from "./follow.sql.js";
import {status} from "../../config/response.status.js";
import {BaseError} from "../../config/error.js";

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