export const getShortsByCategory = "SELECT * FROM shorts JOIN book on shorts.book_id = book.book_id WHERE book.category = ? ORDER BY shorts.CREATED_AT DESC LIMIT ? OFFSET ?";

export const getUserById = "SELECT * FROM users WHERE user_id = ?";

export const findIslike = "SELECT EXISTS(SELECT 1 FROM LIKE_SHORTS WHERE user_id = ? AND shorts_id = ?) AS isLiked";

export const getLikecount = "SELECT COUNT(*) AS likeCount FROM like_shorts WHERE shortsId = ?";

export const getCommentcount = "SELECT COUNT(*) AS commentCount FROM comment WHERE shortsId = ?";

export const getUserCategories = "SELECT c.category_id, c.name, CASE WHEN uf.user_id IS NOT NULL THEN 0 ELSE 1 END AS sort_order FROM category c LEFT JOIN user_favorite uf ON c.category_id = uf.category_id AND uf.user_id = ? ORDER BY sort_order, c.name ASC";

export const getAllCategories = "SELECT * FROM category ORDER BY name ASC";
