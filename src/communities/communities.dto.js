export class JoinCommunityDTO {
    constructor(community_id, user_id) {
        this.community_id = community_id;
        this.user_id = user_id;
    }

    static fromQuery(query) {
        const { community_id, user_id } = query;
        if (!community_id || !user_id) {
            throw new Error(`필요한 정보가 누락되었습니다: ${!community_id ? 'community_id' : ''} ${!user_id ? 'user_id' : ''}`);
        }
        return new JoinCommunityDTO(community_id, user_id);
    }
}
