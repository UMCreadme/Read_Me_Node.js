export const getBookById = "SELECT * FROM book WHERE book_id = ?";

// 책에 해당하는 카테고리 조회
export const findCategoryNameByBookId = 
`SELECT c.name FROM BOOK b
JOIN CATEGORY c ON b.category_id = c.category_id
WHERE b.book_id = ?;`;

// ISBN으로 책 ID 조회
export const findBookIdByISBN = "SELECT book_id FROM BOOK WHERE ISBN = ?;";

// 카테고리 이름으로 카테고리 ID 조회
export const findCategoryIdByName = "SELECT category_id FROM CATEGORY WHERE name = ?;";

// 유저가 읽은 책 ID 조회 TODO: 추후 유저 도메인으로 옮기기
export const isUserReadBookById = "SELECT book_id FROM USER_BOOK WHERE user_id = ? AND book_id = ?;";
