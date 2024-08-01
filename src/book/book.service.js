import {findUserRecentBookList} from "./book.dao.js";

export const findUserRecentBook = async (body, offset, limit) => {
    const userId = body.id
    return await findUserRecentBookList(userId, offset, limit)
}