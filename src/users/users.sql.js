export const getUserById = "SELECT * FROM user WHERE user_id = ?";

export const getUserShortsById = "SELECT * FROM shorts WHERE user_id = ?";

export const getUserLikeShortsIdById = "SELECT shorts_id FROM like_shorts WHERE user_id = ?"

export const getUserReadBooksIdById = "SELECT book_id FROM user_book WHERE user_id = ?"