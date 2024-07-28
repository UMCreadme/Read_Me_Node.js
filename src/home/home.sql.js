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