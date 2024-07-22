import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getShortsDetailByCategory } from "./shorts.detail.sql.js";
import { isFollowUser, isLikeShorts } from "./shorts.sql.js";

export const getShortsDetailToCategory = async (category, size, offset, userId=null) => {
    try {
        const conn = await pool.getConnection();
        const [shorts] = await conn.query(getShortsDetailByCategory, [category, size, offset]);

        for(const short of shorts) {
            if(userId != null) {
                const [isLike] = await conn.query(isLikeShorts, [userId, short.shorts_id]);
                const [isFollow] = await conn.query(isFollowUser, [userId, short.user_id]);

                short.isLike = isLike;
                short.isFollow = isFollow;
            } else {
                short.isLike = false;
                short.isFollow = false;
            }
        }

        conn.release();

        return shorts;
    } catch (err) {
        console.log(err);
        if(err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }
    }
}
