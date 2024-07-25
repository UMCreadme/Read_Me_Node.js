export const getShortsByCategory = "SELECT * FROM shorts JOIN book on shorts.book_id = book.book_id WHERE book.category = ? ORDER BY shorts.CREATED_AT DESC LIMIT ? OFFSET ?";

export const getUserById = "SELECT * FROM users WHERE user_id = ?";

export const findIslike = "SELECT EXISTS(SELECT 1 FROM LIKE_SHORTS WHERE user_id = ? AND shorts_id = ?) AS isLiked";

export const getLikecount = "SELECT COUNT(*) AS likeCount FROM like_shorts WHERE shortsId = ?";

export const getCommentcount = "SELECT COUNT(*) AS commentCount FROM comment WHERE shortsId = ?";