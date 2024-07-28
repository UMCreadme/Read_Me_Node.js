export const getShortsByCategory = "SELECT * FROM shorts JOIN book on shorts.book_id = book.book_id WHERE book.category = ? ORDER BY shorts.CREATED_AT DESC LIMIT ? OFFSET ?";

export const getUserById = "SELECT * FROM users WHERE user_id = ?";

export const findIslike = "SELECT EXISTS(SELECT 1 FROM LIKE_SHORTS WHERE user_id = ? AND shorts_id = ?) AS isLiked";

export const getLikecount = "SELECT COUNT(*) AS likeCount FROM like_shorts WHERE shortsId = ?";

export const getCommentcount = "SELECT COUNT(*) AS commentCount FROM comment WHERE shortsId = ?";

export const getUserCategories = "SELECT c.category_id, c.name, CASE WHEN uf.user_id IS NOT NULL THEN 0 ELSE 1 END AS sort_order FROM category c LEFT JOIN user_favorite uf ON c.category_id = uf.category_id AND uf.user_id = ? ORDER BY sort_order, c.name ASC";

export const getAllCategories = "SELECT * FROM category ORDER BY name ASC";

export const getUserRecommendedShorts = "SELECT s.shorts_id, s.image_url, s.phrase, s.title, s.author, s.translator, s.category FROM shorts s JOIN book b ON s.book_id = b.book_id JOIN category c ON b.category_id = c.category_id WHERE c.name IN (?) ORDER BY s.created_at DESC LIMIT ? OFFSET ?";

export const getShort = "SELECT s.shorts_id, s.image_url, s.phrase, s.title, s.author, s.translator, s.category FROM shorts ORDER BY s.created_at DESC LIMIT ? OFFSET ?";

export const getFollowerFeed = "SELECT u.user_id, u.image_url AS profileImg, u.nickname, s.shorts_id, s.image_url AS shortsImg, s.phrase, s.title, s.content, s.tags, (SELECT COUNT(*) FROM like_shorts ls WHERE ls.shorts_id = s.shorts_id) AS likeCnt, (SELECT COUNT(*) FROM comment c WHERE c.shorts_id = s.shorts_id) AS commentCnt, s.created_at, EXISTS(SELECT 1 FROM like_shorts WHERE shorts_id = s.shorts_id AND user_id = ?) AS isLike FROM users u JOIN follow f on u.user_id = f.follower JOIN shorts s ON u.user_id = s.user_id WHERE f.user_id = ? ORDER BY likeCnt DESC LIMIT ? OFFSET ?";