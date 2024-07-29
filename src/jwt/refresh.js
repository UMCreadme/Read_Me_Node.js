// refresh.js
import {sign, verify, refreshVerify} from "./jwt-util.js";
import jwt from "jsonwebtoken"

export const refresh = async (req, res) => {

    if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;

        const authResult = verify(authToken);
        const decoded = jwt.decode(authToken);

        // 액세스 토큰이 아예 없었던 토큰인 경우
        if (decoded === null) {
            res.status(401).send({
                ok: false,
                message: '권한이 없음. 새로 로그인 필요',
            });
        }

        const refreshResult = refreshVerify(refreshToken, decoded.id);


        if (authResult.ok === false && authResult.message === 'jwt expired') {

            if (refreshResult.ok === false) {
                res.status(401).send({
                    ok: false,
                    message: '권한이 없음. 새로 로그인 필요',
                });
            }

            else {
                // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
                const newAccessToken = sign(decoded);
                res.status(200).send({ // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
                    ok: true,
                    data: {
                        accessToken: newAccessToken,
                        refreshToken,
                    },
                });
            }
        }
        else {
            // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
            res.status(400).send({
                ok: false,
                message: '엑세스 토큰이 만료되지 않았습니다.',
            });
        }
    } else { // access token 또는 refresh token이 헤더에 없는 경우
        res.status(400).send({
            ok: false,
            message: '헤더에 엑세스토큰 혹은 리프레시 토큰 값이 존재하지 않습니다.',
        });
    }
};
