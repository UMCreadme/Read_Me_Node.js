// 쇼츠 좋아요 여부 조회
export const isLikeShorts = "SELECT * FROM LIKE_SHORTS WHERE user_id = ? AND shorts_id = ?;";

// 유저 팔로우 여부 조회
export const isFollowUser = "SELECT * FROM FOLLOW WHERE follower = ? AND user_id = ?;";