
export const getUserFollowings = "SELECT * FROM follow WHERE from_follow = ?"
export const getUserFollowers = "SELECT * FROM follow WHERE to_follow = ?"