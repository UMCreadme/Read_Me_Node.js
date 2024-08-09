// 쇼츠 좋아요 여부 조회
export const isLikeShorts = "SELECT * FROM LIKE_SHORTS WHERE user_id = ? AND shorts_id = ?;";

// 책에 해당하는 쇼츠 개수 조회
export const countShortsDetailByBookId = "SELECT COUNT(*) AS total FROM SHORTS WHERE book_id = ? AND is_deleted = false;";

// 쇼츠 ID로 조회
export const getShortsById = "SELECT * FROM SHORTS WHERE shorts_id = ?";

// 책 제목에서 키워드로 쇼츠 검색
export const getShortsByTitleKeyword = 
`SELECT 
    u.user_id, u.account, u.image_url AS profile_img,
    s.shorts_id, s.image_url AS shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    b.book_id, b.title AS book_title, b.author, c.name AS category,
    COALESCE(likes.like_count, 0) AS like_count, 
    COALESCE(comments.comment_count, 0) AS comment_count
FROM SHORTS s
LEFT JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN BOOK b ON s.book_id = b.book_id
LEFT JOIN CATEGORY c ON b.category_id = c.category_id
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
WHERE b.title REGEXP ? AND is_deleted = false
ORDER BY like_count DESC;`;

// 저자에서 키워드로 쇼츠 검색
export const getShortsByAuthorKeyword =
`SELECT 
    u.user_id, u.account, u.image_url AS profile_img,
    s.shorts_id, s.image_url AS shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    b.book_id, b.title AS book_title, b.author, c.name AS category,
    COALESCE(likes.like_count, 0) AS like_count, 
    COALESCE(comments.comment_count, 0) AS comment_count
FROM SHORTS s
LEFT JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN BOOK b ON s.book_id = b.book_id
LEFT JOIN CATEGORY c ON b.category_id = c.category_id
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
WHERE b.author REGEXP ? AND is_deleted = false
ORDER BY like_count DESC;`;

// 태그에서 키워드로 쇼츠 검색
export const getShortsByTagKeyword =
`SELECT 
    u.user_id, u.account, u.image_url AS profile_img,
    s.shorts_id, s.image_url AS shorts_img, s.phrase, s.phrase_x, s.phrase_y, s.title, s.content, s.tag,
    b.book_id, b.title AS book_title, b.author, c.name AS category,
    COALESCE(likes.like_count, 0) AS like_count, 
    COALESCE(comments.comment_count, 0) AS comment_count
FROM SHORTS s
LEFT JOIN USERS u ON s.user_id = u.user_id
LEFT JOIN BOOK b ON s.book_id = b.book_id
LEFT JOIN CATEGORY c ON b.category_id = c.category_id
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
WHERE s.tag REGEXP ? AND is_deleted = false
ORDER BY like_count DESC;`;


// 쇼츠에 댓글 달기
export const addComment = "INSERT INTO COMMENT (shorts_id, user_id, comment) VALUES (?, ?, ?);";

export const checkLike = "SELECT COUNT(*) as count FROM LIKE_SHORTS WHERE shorts_id = ? AND user_id = ?";

export const addLike = "INSERT INTO LIKE_SHORTS (shorts_id, user_id) VALUES (?, ?)";

export const removeLike = "DELETE FROM LIKE_SHORTS WHERE shorts_id = ? AND user_id = ?";
