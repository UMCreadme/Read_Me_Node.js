import jwt from 'jsonwebtoken';
import { pool } from '../../config/db.config.js';
import { getRefreshToken } from '../users/users.sql.js';

const secret = process.env.SECRET_KEY;

export const sign = (user) => { // access token 발급
    const payload = { // access token에 들어갈 payload
        user_id: user.user_id,
        email: user.email
    };

    return jwt.sign(payload, secret, { // secret으로 sign하여 발급하고 return
        algorithm: 'HS256', // 암호화 알고리즘
        expiresIn: '14d', 	  // 유효기간
    });
};

export const verify = (token) => { // access token 검증
    let decoded = null;
    try {
        decoded = jwt.verify(token, secret);
        return {
            ok: true,
            user_id: decoded.user_id,
            email: decoded.email,
        };
    } catch (err) {
        return {
            ok: false,
            message: err.message,
        };
    }
};

export const refresh = () => { // refresh token 발급
    return jwt.sign({}, secret, { // refresh token은 payload 없이 발급
        algorithm: 'HS256',
        expiresIn: '14d',
    });
};

export const refreshVerify = async (token, userId) => {
    const conn = await pool.getConnection();
    const [refreshTokenResult] = await conn.query(getRefreshToken, [userId]);

    if(refreshTokenResult[0].refresh_token === undefined){
        conn.release();
        return {ok: false, message: '유효하지 않은 리프레시 토큰입니다.'}
    }

    const refreshToken = refreshTokenResult[0].refresh_token;

    conn.release();

    try {
        if (token === refreshToken) {
            try {
                jwt.verify(token, secret);
                return { ok: true };
            } catch (err) {
                return { ok: false, message: err.message };
            }
        } else {
            return { ok: false, message: '유효하지 않은 리프레시 토큰입니다.' };
        }
    } catch (err) {
        return { ok: false, message: err.message };
    }
};
