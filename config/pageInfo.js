// response.js

export const pageInfo = (page, size, totalElements, totalPages) => {
    return {
        page: page,
        size: size,
        totalElements: totalElements,
        totalPages: totalPages
    }
};