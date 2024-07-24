export const getBookById = "SELECT * FROM book WHERE book_id = ?";

// 책에 해당하는 카테고리 조회
export const findCategoryNameByBookId = 
`SELECT c.name FROM BOOK b
JOIN BOOK_CATEGORY bc ON b.book_id = bc.book_id
JOIN CATEGORY c ON bc.category_id = c.category_id
WHERE b.book_id = ?;`;