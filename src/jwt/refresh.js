import { sign, verify, refreshVerify } from "./jwt-util.js";
import jwt from "jsonwebtoken";
import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";

export const refresh = async (req, res) => {
    if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;

        const authResult = verify(authToken);
        const decoded = jwt.decode(authToken);

        if (decoded === null) { // 액세스 토큰이 아예 없었던 토큰인 경우
            return res.send(response(status.NOT_EXISTING_ACCESS_TOKEN, null));
        }

        const refreshResult = await refreshVerify(refreshToken, decoded.id);

        if (authResult.ok === false && authResult.message === 'jwt expired') {
            // refresh token도 만료된 경우
            if (refreshResult.ok === false) {
                return res.send(response(status.REFRESH_TOKEN_EXPIRED, null));
            }
            else {
                // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
                const newAccessToken = sign(decoded);
                return res.send(response(status.SUCCESS, { accessToken: newAccessToken, refreshToken }));
            }
        } else { // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
            return res.send(response(status.ACCESS_TOKEN_NOT_EXPIRED, null));
        }
    } else { // access token 또는 refresh token이 헤더에 없는 경우
        return res.send(response(status.MISSING_TOKEN, null));
    }
};
