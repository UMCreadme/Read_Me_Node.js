export const getUserById = "SELECT * FROM users WHERE user_id = ?";
export const getUserFollowings = "SELECT * FROM follow WHERE follower = ?"
export const getUserFollowers = "SELECT * FROM follow WHERE user_id = ?"

export const getUserShortsById = "SELECT * FROM shorts WHERE user_id = ? LIMIT ? OFFSET ?";

export const getUserLikeShortsIdById = "SELECT shorts_id FROM like_shorts WHERE user_id = ? LIMIT ? OFFSET ?"

export const getUserReadBooksIdById = "SELECT book_id FROM user_book WHERE user_id = ?"