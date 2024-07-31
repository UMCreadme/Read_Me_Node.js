import { verify } from "./jwt-util.js";
import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";

export const authJWT = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1]; // header에서 access token을 가져옵니다.
        const result = verify(token); // token을 검증합니다.

        if (result.ok) { // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
            req.user_id = result.user_id;
            req.email = result.email;
            next();
        }
        else { // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
            if(result.message === 'jwt expired'){
                res.send(response(status.ACCESS_TOKEN_EXPIRED))
            }
            else {
                res.send(response(status.BAD_REQUEST));
            }
        }
    }
    else {
        res.send(response(status.MISSING_TOKEN));
    }
};
