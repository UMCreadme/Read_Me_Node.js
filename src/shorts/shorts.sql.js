// 쇼츠 좋아요 여부 조회
export const isLikeShorts = "SELECT * FROM LIKE_SHORTS WHERE user_id = ? AND shorts_id = ?;";

// 책에 해당하는 쇼츠 개수 조회
export const countShortsDetailByBookId = "SELECT COUNT(*) AS total FROM SHORTS WHERE book_id = ?;";

// 쇼츠 ID로 조회
export const getShortsById = "SELECT * FROM shorts WHERE shorts_id = ?";