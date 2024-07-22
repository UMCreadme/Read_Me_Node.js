export const getShortsDetailByCategory = 
`-- 1. category_name으로 category_id를 찾는 CTE
WITH category_id AS (
    SELECT category_id
    FROM CATEGORY
    WHERE name = ?
),

-- 2. 사용자의 팔로워 수를 계산하는 CTE
followed_users AS (
    SELECT f.user_id AS followed_user_id, COUNT(f.follow_id) AS follower_count
    FROM FOLLOW f
    GROUP BY f.user_id
),

-- 3. shorts와 해당 shorts의 좋아요 수, 댓글 수, 팔로워 수를 조인하는 CTE
shorts_with_followers AS (
    SELECT s.shorts_id, s.user_id, s.book_id, s.image_id,
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
            JOIN BOOK_CATEGORY bc ON b.book_id = bc.book_id
            JOIN category_id c ON bc.category_id = c.category_id
        )
)

-- 4. 최종 결과를 가져오는 쿼리
SELECT
    s.user_id, u.account, i.url AS profile_img,
    s.like_count, s.comment_count, s.book_id
FROM shorts_with_followers s
JOIN USERS u ON s.user_id = u.user_id
JOIN IMAGE i ON u.image_id = i.image_id
JOIN IMAGE si ON s.image_id = si.image_id
GROUP BY s.shorts_id, u.user_id, i.url, si.url
ORDER BY s.follower_count DESC, s.like_count DESC
LIMIT ? OFFSET ?;`;