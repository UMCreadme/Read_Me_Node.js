// 쇼츠 ID에 해당하는 쇼츠 상세 정보를 가져오는 쿼리
export const getShortsDetailById =
`SELECT
    s.user_id, u.account, u.image_url as profile_img,
    s.shorts_id, s.image_url as shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    COALESCE(likes.like_count, 0) AS like_count,
    COALESCE(comments.comment_count, 0) AS comment_count,
    s.book_id
FROM SHORTS s
JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS like_count
    FROM LIKE_SHORTS
    GROUP BY shorts_id
) likes ON s.shorts_id = likes.shorts_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS comment_count
    FROM COMMENT
    GROUP BY shorts_id
) comments ON s.shorts_id = comments.shorts_id
WHERE s.shorts_id = ? AND s.is_deleted = false;`;

// 카테고리별 인기 쇼츠 상세 정보를 가져오는 쿼리
export const getPopularShortsDetailByCategory =
`SELECT s.user_id, u.account, u.image_url as profile_img,
    s.shorts_id, s.image_url as shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    COALESCE(likes.like_count, 0) AS like_count,
    COALESCE(comments.comment_count, 0) AS comment_count,
    s.book_id
FROM SHORTS s
LEFT JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS like_count
    FROM LIKE_SHORTS
    GROUP BY shorts_id
) likes ON s.shorts_id = likes.shorts_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS comment_count
    FROM COMMENT
    GROUP BY shorts_id
) comments ON s.shorts_id = comments.shorts_id
WHERE s.is_deleted = false
AND s.shorts_id != ?
AND COALESCE(likes.like_count, 0) >= ?
AND s.shorts_id IN (
    SELECT s.shorts_id
    FROM SHORTS s
    LEFT JOIN BOOK b ON s.book_id = b.book_id
    WHERE b.category_id = ?
)
LIMIT ? OFFSET ?;`;

// 카테고리별 비인기 쇼츠 상세 정보를 가져오는 쿼리
export const getShortsDetailByCategory =
`SELECT s.user_id, u.account, u.image_url as profile_img,
    s.shorts_id, s.image_url as shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    COALESCE(likes.like_count, 0) AS like_count,
    COALESCE(comments.comment_count, 0) AS comment_count,
    s.book_id
FROM SHORTS s
LEFT JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS like_count
    FROM LIKE_SHORTS
    GROUP BY shorts_id
) likes ON s.shorts_id = likes.shorts_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS comment_count
    FROM COMMENT
    GROUP BY shorts_id
) comments ON s.shorts_id = comments.shorts_id
WHERE s.is_deleted = false
AND s.shorts_id != ?
AND COALESCE(likes.like_count, 0) < ?
AND s.shorts_id IN (
    SELECT s.shorts_id
    FROM SHORTS s
    LEFT JOIN BOOK b ON s.book_id = b.book_id
    WHERE b.category_id = ?
)
ORDER BY like_count DESC
LIMIT ? OFFSET ?;`;

// 카테고리별 인기 쇼츠 상세 정보를 가져오는 쿼리 (특정 쇼츠 ID 제외 - 검색어 or 책)
export const getPopularShortsDetailByCategoryExcludeShorts =
`SELECT s.user_id, u.account, u.image_url as profile_img,
    s.shorts_id, s.image_url as shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    COALESCE(likes.like_count, 0) AS like_count,
    COALESCE(comments.comment_count, 0) AS comment_count,
    s.book_id
FROM SHORTS s
LEFT JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS like_count
    FROM LIKE_SHORTS
    GROUP BY shorts_id
) likes ON s.shorts_id = likes.shorts_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS comment_count
    FROM COMMENT
    GROUP BY shorts_id
) comments ON s.shorts_id = comments.shorts_id
WHERE s.is_deleted = false
AND s.shorts_id NOT IN (<<placeholder>>)
AND COALESCE(likes.like_count, 0) >= ?
AND s.shorts_id IN (
    SELECT s.shorts_id
    FROM SHORTS s
    LEFT JOIN BOOK b ON s.book_id = b.book_id
    WHERE b.category_id = ?
)
ORDER BY like_count DESC
LIMIT ? OFFSET ?;`;

// 카테고리별 비인기 쇼츠 상세 정보를 가져오는 쿼리 (특정 쇼츠 ID 제외 - 검색어 or 책)
export const getShortsDetailByCategoryExcludeShorts =
`SELECT s.user_id, u.account, u.image_url as profile_img,
    s.shorts_id, s.image_url as shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    COALESCE(likes.like_count, 0) AS like_count,
    COALESCE(comments.comment_count, 0) AS comment_count,
    s.book_id
FROM SHORTS s
LEFT JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS like_count
    FROM LIKE_SHORTS
    GROUP BY shorts_id
) likes ON s.shorts_id = likes.shorts_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS comment_count
    FROM COMMENT
    GROUP BY shorts_id
) comments ON s.shorts_id = comments.shorts_id
WHERE s.is_deleted = false
AND s.shorts_id NOT IN (<<placeholder>>)
AND COALESCE(likes.like_count, 0) < ?
AND s.shorts_id IN (
    SELECT s.shorts_id
    FROM SHORTS s
    LEFT JOIN BOOK b ON s.book_id = b.book_id
    WHERE b.category_id = ?
)
ORDER BY like_count DESC
LIMIT ? OFFSET ?;`;

// 책에 해당하는 쇼츠 상세 정보를 가져오는 쿼리
export const getShortsDetailByBook =
`SELECT s.user_id, u.account, u.image_url as profile_img,
    s.shorts_id, s.image_url as shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    COALESCE(likes.like_count, 0) AS like_count,
    COALESCE(comments.comment_count, 0) AS comment_count,
    s.book_id, b.category_id
FROM SHORTS s
LEFT JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN BOOK b ON s.book_id = b.book_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS like_count
    FROM LIKE_SHORTS
    GROUP BY shorts_id
) likes ON s.shorts_id = likes.shorts_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS comment_count
    FROM COMMENT
    GROUP BY shorts_id
) comments ON s.shorts_id = comments.shorts_id
WHERE s.is_deleted = false
AND s.book_id = ?
ORDER BY like_count DESC
LIMIT ? OFFSET ?;`;

// 책에 해당하는 쇼츠 상세 정보를 가져오는 쿼리
export const getShortsDetailByBookWithoutPagination =
`SELECT s.user_id, u.account, u.image_url as profile_img,
    s.shorts_id, s.image_url as shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    COALESCE(likes.like_count, 0) AS like_count,
    COALESCE(comments.comment_count, 0) AS comment_count,
    s.book_id, b.category_id
FROM SHORTS s
LEFT JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN BOOK b ON s.book_id = b.book_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS like_count
    FROM LIKE_SHORTS
    GROUP BY shorts_id
) likes ON s.shorts_id = likes.shorts_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS comment_count
    FROM COMMENT
    GROUP BY shorts_id
) comments ON s.shorts_id = comments.shorts_id
WHERE s.is_deleted = false
AND s.book_id = ?
ORDER BY like_count DESC;`;

//----------------------------------------------------------------

// 사용자가 작성한 쇼츠 상세 정보를 가져오는 쿼리
export const getShortsDetailByUser =
`SELECT 
    s.user_id, u.account, u.image_url AS profile_img,
    s.image_url AS shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    COALESCE(likes.like_count, 0) AS like_count, 
    COALESCE(comments.comment_count, 0) AS comment_count,
    s.book_id
FROM SHORTS s
JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS like_count
    FROM LIKE_SHORTS
    GROUP BY shorts_id
) likes ON s.shorts_id = likes.shorts_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS comment_count
    FROM COMMENT
    GROUP BY shorts_id
) comments ON s.shorts_id = comments.shorts_id
WHERE s.user_id = ? AND s.created_at <= (SELECT created_at FROM SHORTS WHERE shorts_id = ?) AND s.is_deleted = false
GROUP BY s.shorts_id, u.user_id
ORDER BY s.created_at DESC
LIMIT ? OFFSET ?;`;

// 사용자가 좋아요한 쇼츠 상세 정보를 가져오는 쿼리
export const getShortsDetailByUserLike =
`SELECT 
    s.user_id, u.account, u.image_url AS profile_img,
    s.image_url AS shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    COALESCE(likes.like_count, 0) AS like_count, 
    COALESCE(comments.comment_count, 0) AS comment_count,
    s.book_id
FROM SHORTS s
INNER JOIN LIKE_SHORTS ls ON s.shorts_id = ls.shorts_id AND ls.user_id = ?
LEFT JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS like_count
    FROM LIKE_SHORTS
    GROUP BY shorts_id
) likes ON s.shorts_id = likes.shorts_id
LEFT JOIN (
    SELECT shorts_id, COUNT(*) AS comment_count
    FROM COMMENT
    GROUP BY shorts_id
) comments ON s.shorts_id = comments.shorts_id
WHERE ls.created_at <= (SELECT created_at FROM LIKE_SHORTS WHERE user_id = ? AND shorts_id = ?) AND s.is_deleted = false
GROUP BY s.shorts_id, u.user_id, ls.created_at
ORDER BY ls.created_at DESC
LIMIT ? OFFSET ?;`;
