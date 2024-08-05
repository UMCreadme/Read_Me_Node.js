// src/config/response.status.js
import { StatusCodes } from "http-status-codes";

export const status = {
    // success
    SUCCESS: {status: StatusCodes.OK, "isSuccess": true, "code": "2000", "message": "SUCCESS!"},
    CREATED: {status: StatusCodes.CREATED, "isSuccess": true, "code": "2010", "message": "CREATED!"},
    NO_CONTENT: {status: StatusCodes.NO_CONTENT, "isSuccess": true, "code": "2040", "message": "NO CONTENT!"},

    // error
    INTERNAL_SERVER_ERROR: {status: StatusCodes.INTERNAL_SERVER_ERROR, "isSuccess": false, "code": "COMMON000", "message": "서버 에러, 관리자에게 문의 바랍니다."},
    BAD_REQUEST: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "COMMON001", "message": "잘못된 요청입니다."},
    UNAUTHORIZED: {status: StatusCodes.UNAUTHORIZED, "isSuccess": false, "code": "COMMON002", "message": "권한이 잘못되었습니다."},
    METHOD_NOT_ALLOWED: {status: StatusCodes.METHOD_NOT_ALLOWED, "isSuccess": false, "code": "COMMON003", "message": "지원하지 않는 Http Method 입니다."},
    FORBIDDEN: {status: StatusCodes.FORBIDDEN, "isSuccess": false, "code": "COMMON004", "message": "금지된 요청입니다."},
    NOT_FOUND: {status: StatusCodes.NOT_FOUND, "isSuccess": false, "code": "COMMON005", "message": "페이지를 찾을 수 없습니다."},
    PARAMETER_IS_WRONG: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "COMMON006", "message": "잘못된 파라미터입니다."},
    
    // New status code for community creation limit
    COMMUNITY_LIMIT_EXCEEDED: {status: StatusCodes.FORBIDDEN, "isSuccess": false, "code": "COMMUNITY001", "message": "한 사용자가 같은 책으로 5개 이상의 모임을 생성할 수 없습니다."},
    INVALID_CAPACITY: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "COMMUNITY1002", "message": "커뮤니티의 수용 인원(capacity)은 최대 10명까지 허용됩니다." },
    // member err
    MEMBER_NOT_FOUND: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4001", "message": "사용자가 없습니다."},
    NICKNAME_NOT_EXIST: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4002", "message": "닉네임은 필수입니다."},

    // category err
    CATEGORY_NOT_FOUND: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "CATEGORY4001", "message": "존재하지 않는 카테고리입니다."},
    CATEGORY_COUNT_IS_WRONG: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "CATEGORY4002", "message": "카테고리 개수는 4~8개로 입력해주세요."},

    // shorts err
    SHORTS_TAG_COUNT_TOO_LONG: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "SHORTS4001", "message": "태그는 10개 이내로 입력해주세요."},
    SHORTS_TAG_TOO_LONG: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "SHORTS4002", "message": "태그는 10자 이내로 입력해주세요."},
    SHORTS_TITLE_TOO_LONG: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "SHORTS4003", "message": "제목은 30자 이내로 입력해주세요."},
    SHORTS_CONTENT_TOO_LONG: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "SHORTS4004", "message": "내용은 255자 이내로 입력해주세요."},
    SHORTS_PHRASE_TOO_LONG: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "SHORTS4005", "message": "책 구절은 150자 이내로 입력해주세요."},

    // token err
    NOT_EXISTING_ACCESS_TOKEN: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "TOKEN4001", "message": "존재하지 않는 엑세스 토큰 입니다."},

    REFRESH_TOKEN_EXPIRED : {status: StatusCodes.BAD_REQUEST, "isSuccess" : false, "code" : "TOKEN4002", "message" : "만료된 리프레시 토큰 입니다."},
    ACCESS_TOKEN_NOT_EXPIRED : {status: StatusCodes.BAD_REQUEST, "isSuccess" : false, "code" : "TOKEN4003", "message" : "엑세스 토큰이 만료되지 않았습니다."},
    MISSING_TOKEN :{status:StatusCodes.BAD_REQUEST, "isSuccess" : false, "code" : "TOKEN4004", "message" : "헤더에 토큰 값이 존재하지 않습니다."},
    ACCESS_TOKEN_EXPIRED : {status: StatusCodes.BAD_REQUEST, "isSuccess" : false, "code" : "TOKEN4005", "message" : "엑세스 토큰이 만료되었습니다."},
    INVALID_REFRESH_TOKEN : {status: StatusCodes.BAD_REQUEST, "isSuccess" : false, "code" : "TOKEN4005", "message" : "유효하지 않는 리프레시 토큰입니다."}

};

