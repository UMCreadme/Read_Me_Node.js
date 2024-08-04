// communities.dto.js
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';

export class JoinCommunityDTO {
    constructor(community_id, user_id) {
        if (!community_id || !user_id) {
            throw new BaseError(status.PARAMETER_IS_WRONG);
        }

        this.community_id = community_id;
        this.user_id = user_id;
    }
}
