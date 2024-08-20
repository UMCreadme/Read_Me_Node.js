export const getShortsByCategory = 
`
WITH RankedShorts AS (
    SELECT u.user_id, u.image_url AS profileImg, u.nickname,
           s.shorts_id, s.book_id, s.image_url AS shortsImg,
           s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag AS tags,
           (SELECT COUNT(*) FROM LIKE_SHORTS ls WHERE ls.shorts_id = s.shorts_id) AS likeCnt,
           (SELECT COUNT(*) FROM COMMENT c WHERE c.shorts_id = s.shorts_id) AS commentCnt,
           s.created_at,
           EXISTS (
               SELECT 1 
               FROM LIKE_SHORTS ls 
               WHERE ls.shorts_id = s.shorts_id AND ls.user_id = ?
           ) AS isLike
    FROM USERS u
    JOIN SHORTS s ON u.user_id = s.user_id
    JOIN BOOK b ON s.book_id = b.book_id
    WHERE b.category_id = ?
    GROUP BY u.user_id, u.image_url, u.nickname,
             s.shorts_id, s.book_id, s.image_url,
             s.phrase, s.title, s.content, s.tag, s.created_at
    HAVING likeCnt >= 20
    LIMIT ?
),

UnrankedShorts AS (
    SELECT u.user_id, u.image_url AS profileImg, u.nickname,
           s.shorts_id, s.book_id, s.image_url AS shortsImg,
           s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag AS tags,
           (SELECT COUNT(*) FROM LIKE_SHORTS ls WHERE ls.shorts_id = s.shorts_id) AS likeCnt,
           (SELECT COUNT(*) FROM COMMENT c WHERE c.shorts_id = s.shorts_id) AS commentCnt,
           s.created_at,
           EXISTS (
               SELECT 1 
               FROM LIKE_SHORTS ls 
               WHERE ls.shorts_id = s.shorts_id AND ls.user_id = ?
           ) AS isLike
    FROM USERS u
    JOIN SHORTS s ON u.user_id = s.user_id
    JOIN BOOK b ON s.book_id = b.book_id
    WHERE b.category_id = ? AND s.shorts_id NOT IN (SELECT shorts_id FROM RankedShorts)
    LIMIT ?
)

SELECT * FROM (
    SELECT * FROM RankedShorts
    UNION ALL
    SELECT * FROM UnrankedShorts
) AS CombinedResults
ORDER BY RAND();
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

// 유저가 선택한 카테고리의 숏츠 1개씩 반환 + 인기쇼츠 중 랜덤
export const getUserRecommendedShorts = 
`WITH RankedShorts AS (
    SELECT
        s.shorts_id, s.image_url AS shortsImg, s.phrase, s.title, s.phrase_x, s.phrase_y,
        b.author,
        c.name AS category, c.category_id,
        COALESCE(likes.like_count, 0) AS like_count,
        ROW_NUMBER() OVER (PARTITION BY c.category_id ORDER BY RAND()) AS rn
    FROM SHORTS s
    LEFT JOIN BOOK b ON s.book_id = b.book_id
    LEFT JOIN USER_FAVORITE uf ON b.category_id = uf.category_id
    LEFT JOIN CATEGORY c ON uf.category_id = c.category_id
    LEFT JOIN (
        SELECT shorts_id, COUNT(*) AS like_count
        FROM LIKE_SHORTS
        GROUP BY shorts_id
    ) likes ON s.shorts_id = likes.shorts_id
    WHERE COALESCE(likes.like_count, 0) >= ? AND uf.user_id = ?
)
SELECT
    shorts_id, shortsImg, phrase, phrase_x, phrase_y, title, author, category, like_count
FROM RankedShorts
WHERE rn = 1
ORDER BY category_id;
`;

// 전체 숏츠 조회 + 좋아요순으로 정렬
export const getShort = 
`SELECT s.shorts_id, s.image_url, s.phrase, s.phrase_x, s.phrase_y, s.title, b.author, c.name AS category, COUNT(ls.like_shorts_id) AS likeCnt
FROM SHORTS s
JOIN BOOK b ON s.book_id = b.book_id 
JOIN CATEGORY c ON b.category_id = c.category_id
LEFT JOIN LIKE_SHORTS ls ON s.shorts_id = ls.shorts_id
GROUP BY s.shorts_id, s.image_url, s.phrase, s.title, b.author, c.name
ORDER BY likeCnt DESC, s.created_at DESC
LIMIT ? OFFSET ?;
`;

// 유저의 팔로워들이 올린 피드 리스트 반환
export const getFollowerFeed = 
`SELECT 
u.user_id, u.image_url AS profileImg, 
u.nickname, s.shorts_id, s.image_url AS shortsImg, 
s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag, 
COUNT(ls.like_shorts_id) AS likeCnt, 
COUNT(c.comment_id) AS commentCnt, 
s.created_at, 
EXISTS(SELECT 1 FROM LIKE_SHORTS WHERE shorts_id = s.shorts_id AND user_id = ?) AS isLike 
FROM USERS u 
JOIN FOLLOW f ON u.user_id = f.follower 
JOIN SHORTS s ON u.user_id = s.user_id 
LEFT JOIN LIKE_SHORTS ls ON s.shorts_id = ls.shorts_id 
LEFT JOIN COMMENT c ON s.shorts_id = c.shorts_id 
WHERE f.user_id = ? 
AND s.created_at >= NOW() - INTERVAL 24 HOUR
GROUP BY u.user_id, u.image_url, u.nickname, s.shorts_id, s.image_url, s.phrase, s.title, s.content, s.tag, s.created_at
ORDER BY s.created_at DESC
LIMIT ? OFFSET ?;
`;