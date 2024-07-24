export const getBookById = "SELECT * FROM book WHERE book_id = ?";

// 책에 해당하는 카테고리 조회
export const findCategoryNameByBookId = 
`SELECT c.name FROM BOOK b
JOIN CATEGORY c ON b.category_id = c.category_id
WHERE b.book_id = ?;`;