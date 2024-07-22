<<<<<<< HEAD
// response.js

export const response = ({isSuccess, code, message}, result, pageInfo = null) => {
=======
export const response = ({isSuccess, code, message}, result, pageInfo) => {
>>>>>>> faf341883873f64c843ea367f6eacdbe59a67eb4
    return {
        isSuccess: isSuccess,
        code: code,
        message: message,
        pageInfo: pageInfo,
        result: result
    }
};