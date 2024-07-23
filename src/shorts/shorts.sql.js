// 쇼츠 좋아요 여부 조회
export const isLikeShorts = "SELECT * FROM LIKE_SHORTS WHERE user_id = ? AND shorts_id = ?;";

// 유저 팔로우 여부 조회 TODO: user 도메인으로 옮기기
export const isFollowUser = "SELECT * FROM FOLLOW WHERE follower = ? AND user_id = ?;";

// 책 존재 여부 조회 TODO: book 도메인으로 옮기기
export const findBookById = "SELECT * FROM BOOK WHERE book_id = ?;";

// 책에 해당하는 쇼츠 개수 조회
export const countShortsDetailByBookId = "SELECT COUNT(*) AS total FROM SHORTS WHERE book_id = ?;";

// 책에 해당하는 카테고리 조회 TODO: book 도메인으로 옮기기
export const findCategoryNameByBookId = "SELECT c.name FROM BOOK b JOIN BOOK_CATEGORY bc ON b.book_id = bc.book_id JOIN CATEGORY c ON bc.category_id = c.category_id WHERE b.book_id = ?;";