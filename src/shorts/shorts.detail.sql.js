// 쇼츠 ID에 해당하는 쇼츠 상세 정보를 가져오는 쿼리
export const getShortsDetailById =
`SELECT
    s.user_id, u.account, u.image_url AS profile_img,
    s.image_url AS shorts_img, s.phrase, s.title, s.content, s.tag,
    likes.like_count, comments.comment_count, s.book_id
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
WHERE s.shorts_id = ?;`;

// 카테고리별 쇼츠 상세 정보를 가져오는 쿼리
export const getShortsDetailByCategory = 
`-- 1. 사용자의 팔로워 수를 계산하는 CTE
WITH followed_users AS (
    SELECT f.user_id AS followed_user_id, COUNT(f.follow_id) AS follower_count
    FROM FOLLOW f
    GROUP BY f.user_id
),

-- 2. shorts와 해당 shorts의 좋아요 수, 댓글 수, 팔로워 수를 조인하는 CTE
shorts_with_followers AS (
    SELECT s.shorts_id, s.user_id, s.book_id, s.image_url,
        s.phrase, s.title, s.content, s.tag,
        COALESCE(likes.like_count, 0) AS like_count, 
        COALESCE(comments.comment_count, 0) AS comment_count,
        COALESCE(f.follower_count, 0) AS follower_count
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
    LEFT JOIN followed_users f ON u.user_id = f.followed_user_id
    WHERE
        s.shorts_id IN (
            SELECT s.shorts_id
            FROM SHORTS s
            JOIN BOOK b ON s.book_id = b.book_id
            JOIN CATEGORY c ON b.category_id = c.category_id
            WHERE c.name = ?
        )
)

-- 3. 최종 결과를 가져오는 쿼리
SELECT
    s.user_id, u.account, u.image_url AS profile_img,
    s.image_url AS shorts_img, s.phrase, s.title, s.content, s.tag,
    s.like_count, s.comment_count, s.book_id
FROM shorts_with_followers s
JOIN USERS u ON s.user_id = u.user_id
WHERE s.shorts_id != ?
GROUP BY s.shorts_id, u.user_id
ORDER BY s.follower_count DESC, s.like_count DESC
LIMIT ? OFFSET ?;`;

// 카테고리별 쇼츠 상세 정보를 가져오는 쿼리 (검색어로 노출된 쇼츠 제외)
export const getShortsDetailByCategoryExcludeKeyword =
`-- 1. 사용자의 팔로워 수를 계산하는 CTE
WITH followed_users AS (
    SELECT f.user_id AS followed_user_id, COUNT(f.follow_id) AS follower_count
    FROM FOLLOW f
    GROUP BY f.user_id
),

-- 2. shorts와 해당 shorts의 좋아요 수, 댓글 수, 팔로워 수를 조인하는 CTE
shorts_with_followers AS (
    SELECT s.shorts_id, s.user_id, s.book_id, s.image_url,
        s.phrase, s.title, s.content, s.tag,
        COALESCE(likes.like_count, 0) AS like_count, 
        COALESCE(comments.comment_count, 0) AS comment_count,
        COALESCE(f.follower_count, 0) AS follower_count
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
    LEFT JOIN followed_users f ON u.user_id = f.followed_user_id
    WHERE
        s.shorts_id IN (
            SELECT s.shorts_id
            FROM SHORTS s
            JOIN BOOK b ON s.book_id = b.book_id
            JOIN CATEGORY c ON b.category_id = c.category_id
            WHERE c.name = ?
        )
)

-- 3. 최종 결과를 가져오는 쿼리
SELECT
    s.user_id, u.account, u.image_url AS profile_img,
    s.image_url AS shorts_img, s.phrase, s.title, s.content, s.tag,
    s.like_count, s.comment_count, s.book_id
FROM shorts_with_followers s
JOIN USERS u ON s.user_id = u.user_id
WHERE s.shorts_id NOT IN (<<placeholder>>)
GROUP BY s.shorts_id, u.user_id
ORDER BY s.follower_count DESC, s.like_count DESC
LIMIT ? OFFSET ?;`;

// 카테고리별 쇼츠 상세 정보를 가져오는 쿼리 (책 제외)
export const getShortsDetailByCategoryExcludeBook =
`-- 1. 사용자의 팔로워 수를 계산하는 CTE
WITH followed_users AS (
    SELECT f.user_id AS followed_user_id, COUNT(f.follow_id) AS follower_count
    FROM FOLLOW f
    GROUP BY f.user_id
),

-- 2. shorts와 해당 shorts의 좋아요 수, 댓글 수, 팔로워 수를 조인하는 CTE
shorts_with_followers AS (
    SELECT s.shorts_id, s.user_id, s.book_id, s.image_url,
        s.phrase, s.title, s.content, s.tag,
        COALESCE(likes.like_count, 0) AS like_count, 
        COALESCE(comments.comment_count, 0) AS comment_count,
        COALESCE(f.follower_count, 0) AS follower_count
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
    LEFT JOIN followed_users f ON u.user_id = f.followed_user_id
    WHERE
        s.shorts_id IN (
            SELECT s.shorts_id
            FROM SHORTS s
            JOIN BOOK b ON s.book_id = b.book_id
            JOIN CATEGORY c ON b.category_id = c.category_id
            WHERE c.name = ? AND s.book_id != ?
        )
)

-- 3. 최종 결과를 가져오는 쿼리
SELECT
    s.user_id, u.account, u.image_url AS profile_img,
    s.image_url AS shorts_img, s.phrase, s.title, s.content, s.tag,
    s.like_count, s.comment_count, s.book_id
FROM shorts_with_followers s
JOIN USERS u ON s.user_id = u.user_id
GROUP BY s.shorts_id, u.user_id
ORDER BY s.follower_count DESC, s.like_count DESC
LIMIT ? OFFSET ?;`;

// 책에 해당하는 쇼츠 상세 정보를 가져오는 쿼리
export const getShortsDetailByBook =
`-- 1. 사용자의 팔로워 수를 계산하는 CTE
WITH followed_users AS (
    SELECT f.user_id AS followed_user_id, COUNT(f.follow_id) AS follower_count
    FROM FOLLOW f
    GROUP BY f.user_id
),

-- 2. shorts와 해당 shorts의 좋아요 수, 댓글 수, 팔로워 수를 조인하는 CTE
shorts_with_followers AS (
    SELECT s.shorts_id, s.user_id, s.book_id, s.image_url,
        s.phrase, s.title, s.content, s.tag,
        COALESCE(likes.like_count, 0) AS like_count, 
        COALESCE(comments.comment_count, 0) AS comment_count,
        COALESCE(f.follower_count, 0) AS follower_count
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
    LEFT JOIN followed_users f ON u.user_id = f.followed_user_id
    WHERE
        s.shorts_id IN (
            SELECT s.shorts_id
            FROM SHORTS s
            JOIN BOOK b ON s.book_id = b.book_id
            WHERE b.book_id = ?
        )
)

-- 3. 최종 결과를 가져오는 쿼리
SELECT
    s.user_id, u.account, u.image_url AS profile_img,
    s.image_url AS shorts_img, s.phrase, s.title, s.content, s.tag,
    s.like_count, s.comment_count, s.book_id
FROM shorts_with_followers s
JOIN USERS u ON s.user_id = u.user_id
WHERE s.shorts_id != ?
GROUP BY s.shorts_id, u.user_id
ORDER BY s.follower_count DESC, s.like_count DESC
LIMIT ? OFFSET ?;`;

// 사용자가 작성한 쇼츠 상세 정보를 가져오는 쿼리
export const getShortsDetailByUser =
`SELECT 
    s.user_id, u.account, u.image_url AS profile_img,
    s.image_url AS shorts_img, s.phrase, s.title, s.content, s.tag,
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
WHERE s.user_id = ? AND s.created_at <= (SELECT created_at FROM SHORTS WHERE shorts_id = ?)
GROUP BY s.shorts_id, u.user_id
ORDER BY s.created_at DESC
LIMIT ? OFFSET ?;`;

// 사용자가 좋아요한 쇼츠 상세 정보를 가져오는 쿼리
export const getShortsDetailByUserLike =
`SELECT 
    s.user_id, u.account, u.image_url AS profile_img,
    s.image_url AS shorts_img, s.phrase, s.title, s.content, s.tag,
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
WHERE ls.created_at <= (SELECT created_at FROM LIKE_SHORTS WHERE user_id = ? AND shorts_id = ?)
GROUP BY s.shorts_id, u.user_id, ls.created_at
ORDER BY ls.created_at DESC
LIMIT ? OFFSET ?;`;
