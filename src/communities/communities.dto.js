export const createCommunityDto = (data) => ({
    communityId: data.communityId,  // DTO에 필요한 ID만 포함
    userId: data.userId,
    bookId: data.bookId,
    address: data.address.split('|'),
    tag: data.tag ? data.tag.split('|') : [],
    capacity: data.capacity
});
