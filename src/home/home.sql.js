export const getShortsByCategory = 
`WITH FilteredShorts AS (
    SELECT u.user_id, u.image_url AS profileImg, u.nickname,
           s.shorts_id, s.book_id, s.image_url AS shortsImg,
           s.phrase, s.title, s.content, s.tag AS tags,
           (SELECT COUNT(*) FROM LIKE_SHORTS ls WHERE ls.shorts_id = s.shorts_id) AS likeCnt,
           (SELECT COUNT(*) FROM COMMENT c WHERE c.shorts_id = s.shorts_id) AS commentCnt,
           s.created_at
    FROM USERS u
    JOIN SHORTS s ON u.user_id = s.user_id
    JOIN BOOK b ON s.book_id = b.book_id
    WHERE b.category_id = ?
    GROUP BY u.user_id, u.image_url, u.nickname,
             s.shorts_id, s.book_id, s.image_url,
             s.phrase, s.title, s.content, s.tag, s.created_at
    HAVING likeCnt >= 2
),
RankedShorts AS (
    SELECT user_id, profileImg, nickname, shorts_id, book_id, shortsImg,
           phrase, title, content, tags, likeCnt, commentCnt, created_at,
           ROW_NUMBER() OVER (ORDER BY RAND()) AS RN
    FROM FilteredShorts
)
SELECT user_id, profileImg, nickname, shorts_id, book_id, shortsImg,
       phrase, title, content, tags, likeCnt, commentCnt, created_at
FROM RankedShorts
WHERE RN <= 20

UNION ALL

SELECT u.user_id, u.image_url AS profileImg, u.nickname,
       s.shorts_id, s.book_id, s.image_url AS shortsImg,
       s.phrase, s.title, s.content, s.tag AS tags,
       (SELECT COUNT(*) FROM LIKE_SHORTS ls WHERE ls.shorts_id = s.shorts_id) AS likeCnt,
       (SELECT COUNT(*) FROM COMMENT c WHERE c.shorts_id = s.shorts_id) AS commentCnt,
       s.created_at
FROM USERS u
JOIN SHORTS s ON u.user_id = s.user_id
JOIN BOOK b ON s.book_id = b.book_id
WHERE b.category_id = ? AND s.shorts_id NOT IN (SELECT shorts_id FROM RankedShorts)
ORDER BY RAND()
LIMIT 20;
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
`WITH FilteredShorts AS (
    SELECT s.shorts_id, s.image_url AS shortsImg, s.phrase, s.title, b.author, b.translator, c.name AS category, c.category_id, COUNT(ls.like_shorts_id) AS likeCnt
    FROM SHORTS s
    JOIN BOOK b ON s.book_id = b.book_id
    JOIN CATEGORY c ON b.category_id = c.category_id
    JOIN USER_FAVORITE uf ON c.category_id = uf.category_id
    LEFT JOIN LIKE_SHORTS ls ON s.shorts_id = ls.shorts_id
    WHERE uf.user_id = ?
    GROUP BY s.shorts_id, s.image_url, s.phrase, s.title, b.author, b.translator, c.name
    HAVING COUNT(ls.like_shorts_id) >= 1
),
RankedShorts AS (
    SELECT shorts_id, shortsImg, phrase, title, author, translator, category, category_id,likeCnt,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY RAND()) AS RN
    FROM FilteredShorts
)
SELECT shorts_id, shortsImg, phrase, title, author, translator, category, likeCnt
FROM RankedShorts
WHERE rn = 1
ORDER BY category_id;
`;

// 전체 숏츠 조회 + 좋아요순으로 정렬
export const getShort = 
`SELECT s.shorts_id, s.image_url, s.phrase, s.title, b.author, b.translator, c.name AS category, COUNT(ls.like_shorts_id) AS likeCnt
FROM SHORTS s
JOIN BOOK b ON s.book_id = b.book_id 
JOIN CATEGORY c ON b.category_id = c.category_id
LEFT JOIN LIKE_SHORTS ls ON s.shorts_id = ls.shorts_id
GROUP BY s.shorts_id, s.image_url, s.phrase, s.title, b.author, b.translator, c.name
ORDER BY likeCnt DESC, s.created_at DESC
LIMIT ? OFFSET ?;
`;

// 유저의 팔로워들이 올린 피드 리스트 반환
export const getFollowerFeed = 
`SELECT 
u.user_id, u.image_url AS profileImg, 
u.nickname, s.shorts_id, s.image_url AS shortsImg, 
s.phrase, s.title, s.content, s.tag, 
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
ORDER BY likeCnt DESC 
LIMIT ? OFFSET ?;
`;