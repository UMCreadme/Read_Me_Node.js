import {findUserRecentBookList} from "./book.dao.js";

export const findUserRecentBook = async (body, offset, limit) => {
    const userId = body.id //TODO 로그인 미들웨어 추가하면 변경
    return await findUserRecentBookList(userId, offset, limit)
}