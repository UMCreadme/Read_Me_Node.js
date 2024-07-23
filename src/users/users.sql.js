export const getUserById = "SELECT * FROM users WHERE user_id = ?";
export const getUserFollowings = "SELECT * FROM follow WHERE follower = ?"
export const getUserFollowers = "SELECT * FROM follow WHERE user_id = ?"

export const getUserShortsById = "SELECT * FROM shorts WHERE user_id = ? ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?";

export const getUserLikeShortsIdById = "SELECT shorts_id FROM like_shorts WHERE user_id = ? ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?"

export const getUserReadBooksIdById = "SELECT book_id FROM user_book WHERE user_id = ? ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?"

export const getImageById = "SELECT * FROM image WHERE image_id = ?"

export const addFollowUser = "INSERT INTO follow(follower, user_id) VALUES(?, ?)"

export const findFollowStatus = "SELECT * FROM follow WHERE follower = ? AND user_id = ?"