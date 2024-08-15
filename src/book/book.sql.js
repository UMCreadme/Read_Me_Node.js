export const getBookById = "SELECT * FROM BOOK WHERE book_id = ?";

// 책에 해당하는 카테고리 조회
export const findCategoryNameByBookId = 
`SELECT c.name FROM BOOK b
JOIN CATEGORY c ON b.category_id = c.category_id
WHERE b.book_id = ?;`;

// ISBN으로 책 ID 조회
export const findBookIdByISBN = "SELECT book_id FROM BOOK WHERE ISBN = ?;";

// 카테고리 이름으로 카테고리 ID 조회
export const findCategoryIdByName = "SELECT category_id FROM CATEGORY WHERE name = ?;";

// 알라딘 카테고리 cid로 category_id 조회
export const findCategoryIdByAladinCid = "SELECT category_id FROM ALADIN_CATEGORY WHERE cid = ?;";

// 유저가 읽은 책 ID 조회
export const isUserReadBookById = "SELECT book_id FROM USER_BOOK WHERE user_id = ? AND book_id = ?;";

// 유저가 읽은 책 정보 업데이트
export const updateUserBook = "INSERT INTO USER_BOOK (user_id, book_id) VALUES (?, ?);";
export const deleteUserBook = "DELETE FROM USER_BOOK WHERE user_id = ? AND book_id = ?;";

// 유저가 쇼츠 생성시 선택했던 책 최근 리스트 조회
export const getUserRecentBookList = `
SELECT 
    s.book_id,
    b.image_url,
    b.title,
    b.author
FROM 
    SHORTS s
JOIN 
    BOOK b ON s.book_id = b.book_id
WHERE 
    s.user_id = ?
ORDER BY 
    s.created_at DESC,
    s.shorts_id DESC
LIMIT ? OFFSET ?
`;