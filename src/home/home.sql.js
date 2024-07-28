export const getShortsByCategory = 
`SELECT
    u.user_id AS user_id, u.image_url AS profileImg, u.nickname AS nickname,
    s.shorts_id AS shorts_id, s.book_id AS book_id, s.image_url AS shortsImg,
    s.phrase AS phrase, s.title AS title, s.content AS content, s.tag AS tags,
    (SELECT COUNT(*) FROM LIKE_SHORTS ls WHERE ls.shorts_id = s.shorts_id) AS likeCnt,
    (SELECT COUNT(*) FROM COMMENT c WHERE c.shorts_id = s.shorts_id) AS commentCnt,
    s.created_at AS created_at
FROM USERS u
JOIN SHORTS s ON u.user_id = s.user_id
JOIN BOOK b ON s.book_id = b.book_id
WHERE b.category_id = ?
ORDER BY s.created_at DESC
LIMIT ? OFFSET ?;
`;

export const getUserCategories =
`SELECT 
c.name
FROM CATEGORY c
LEFT JOIN USER_FAVORITE uf ON c.category_id = uf.category_id AND uf.user_id = ?
ORDER BY 
  CASE WHEN uf.user_id IS NOT NULL THEN 0 ELSE 1 END, 
  c.category_id;
`;

export const getAllCategories = "SELECT name FROM CATEGORY;";

export const getUserRecommendedShorts = "SELECT s.shorts_id, s.image_url, s.phrase, s.title, s.author, s.translator, s.category FROM shorts s JOIN book b ON s.book_id = b.book_id JOIN category c ON b.category_id = c.category_id WHERE c.name IN (?) ORDER BY s.created_at DESC LIMIT ? OFFSET ?";

export const getShort = "SELECT s.shorts_id, s.image_url, s.phrase, s.title, s.author, s.translator, s.category FROM shorts ORDER BY s.created_at DESC LIMIT ? OFFSET ?";

export const getFollowerFeed = "SELECT u.user_id, u.image_url AS profileImg, u.nickname, s.shorts_id, s.image_url AS shortsImg, s.phrase, s.title, s.content, s.tags, (SELECT COUNT(*) FROM like_shorts ls WHERE ls.shorts_id = s.shorts_id) AS likeCnt, (SELECT COUNT(*) FROM comment c WHERE c.shorts_id = s.shorts_id) AS commentCnt, s.created_at, EXISTS(SELECT 1 FROM like_shorts WHERE shorts_id = s.shorts_id AND user_id = ?) AS isLike FROM users u JOIN follow f on u.user_id = f.follower JOIN shorts s ON u.user_id = s.user_id WHERE f.user_id = ? ORDER BY likeCnt DESC LIMIT ? OFFSET ?";
