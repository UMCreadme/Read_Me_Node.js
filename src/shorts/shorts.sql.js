// 쇼츠 좋아요 여부 조회
export const isLikeShorts = "SELECT * FROM LIKE_SHORTS WHERE user_id = ? AND shorts_id = ?;";

// 책에 해당하는 쇼츠 개수 조회
export const countShortsDetailByBookId = "SELECT COUNT(*) AS total FROM SHORTS WHERE book_id = ?;";

// 쇼츠 ID로 조회
export const getShortsById = "SELECT * FROM shorts WHERE shorts_id = ?";

// 책 제목에서 키워드로 쇼츠 검색
export const getShortsByTitleKeyword = 
`SELECT s.shorts_id, s.phrase, s.tag, i.url AS shorts_img, b.title AS book_title, b.author, b.translator, c.name AS category
FROM SHORTS s
LEFT JOIN BOOK b ON s.book_id = b.book_id
LEFT JOIN IMAGE i ON s.image_id = i.image_id
LEFT JOIN CATEGORY c ON b.category_id = c.category_id
WHERE b.title REGEXP ?
ORDER BY s.created_at DESC;`;

// 저자에서 키워드로 쇼츠 검색
export const getShortsByAuthorKeyword =
`SELECT s.shorts_id, s.phrase, s.tag, i.url AS shorts_img, b.title AS book_title, b.author, b.translator, c.name AS category
FROM SHORTS s
LEFT JOIN BOOK b ON s.book_id = b.book_id
LEFT JOIN IMAGE i ON s.image_id = i.image_id
LEFT JOIN CATEGORY c ON b.category_id = c.category_id
WHERE b.author REGEXP ? OR b.translator REGEXP ?
ORDER BY s.created_at DESC;`;

// 태그에서 키워드로 쇼츠 검색
export const getShortsByTagKeyword =
`SELECT s.shorts_id, s.phrase, s.tag, i.url AS shorts_img, b.title AS book_title, b.author, b.translator, c.name AS category
FROM SHORTS s
LEFT JOIN BOOK b ON s.book_id = b.book_id
LEFT JOIN IMAGE i ON s.image_id = i.image_id
LEFT JOIN CATEGORY c ON b.category_id = c.category_id
WHERE s.tag REGEXP ?
ORDER BY s.created_at DESC;`;