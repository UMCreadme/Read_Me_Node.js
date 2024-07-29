export const communityDto = (data) => ({
    communityId: data.communityId,
    userId: data.userId,
    bookId: data.bookId,
    address: data.address.split('|'),
    tags: data.tags ? data.tags.split('|') : [],
    capacity: data.capacity,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
});
