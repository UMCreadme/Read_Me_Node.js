// response.js

export const response = ({isSuccess, code, message}, result, pageInfo = null) => {
    return {
        isSuccess: isSuccess,
        code: code,
        message: message,
        pageInfo: pageInfo,
        result: result
    }
};