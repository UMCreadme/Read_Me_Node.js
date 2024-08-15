// src/config/response.status.js
import { StatusCodes } from "http-status-codes";

export const status = {
  // success
  SUCCESS: { status: StatusCodes.OK, "isSuccess": true, "code": "2000", "message": "SUCCESS!" },
  CREATED: { status: StatusCodes.CREATED, "isSuccess": true, "code": "2010", "message": "CREATED!" },
  JOINED: { status: StatusCodes.CREATED, "isSuccess": true, "code": "2020", "message": "JOINED!" },
  NO_CONTENT: { status: StatusCodes.NO_CONTENT, "isSuccess": true, "code": "2040", "message": "NO CONTENT!" },

  // error
  INTERNAL_SERVER_ERROR: { status: StatusCodes.INTERNAL_SERVER_ERROR, "isSuccess": false, "code": "COMMON000", "message": "서버 에러, 관리자에게 문의 바랍니다." },
  BAD_REQUEST: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "COMMON001", "message": "잘못된 요청입니다." },
  UNAUTHORIZED: { status: StatusCodes.UNAUTHORIZED, "isSuccess": false, "code": "COMMON002", "message": "권한이 잘못되었습니다." },
  METHOD_NOT_ALLOWED: { status: StatusCodes.METHOD_NOT_ALLOWED, "isSuccess": false, "code": "COMMON003", "message": "지원하지 않는 Http Method 입니다." },
  FORBIDDEN: { status: StatusCodes.FORBIDDEN, "isSuccess": false, "code": "COMMON004", "message": "금지된 요청입니다." },
  NOT_FOUND: { status: StatusCodes.NOT_FOUND, "isSuccess": false, "code": "COMMON005", "message": "페이지를 찾을 수 없습니다." },
  PARAMETER_IS_WRONG: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "COMMON006", "message": "잘못된 파라미터입니다." },

  // community arr
  COMMUNITY_LIMIT_EXCEEDED: { status: StatusCodes.FORBIDDEN, "isSuccess": false, "code": "COMMUNITY001", "message": "한 사용자가 같은 책으로 5개 이상의 모임을 생성할 수 없습니다." },
  INVALID_CAPACITY: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "COMMUNITY1002", "message": "커뮤니티의 수용 인원(capacity)은 최대 10명까지 허용됩니다." },
  COMMUNITY_FULL: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, code: "COMMUNITY4003", "message": "참여 인원 초과로 참여하실 수 없습니다." },
  ALREADY_IN_COMMUNITY: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, code: "COMMUNITY4004", "message": "이미 이 커뮤니티에 참여 중입니다." },
  COMMUNITY_NOT_FOUND: { status: StatusCodes.NOT_FOUND, "isSuccess": false, "code": "COMMUNITY4005", "message": "존재하지 않는 커뮤니티입니다." },
  NOT_IN_COMMUNITY: { status: StatusCodes.NOT_FOUND, "isSuccess": false, code: "COMMUNITY4006", message: "사용자가 해당 커뮤니티에 가입되어 있지 않습니다." },
  CANNOT_LEAVE_OWNED_COMMUNITY: { status: StatusCodes.BAD_REQUEST,"isSuccess": false,  code: "COMMUNITY4007", message: "방장은 커뮤니티를 탈퇴할 수 없습니다. 커뮤니티를 삭제하세요." },
  ALREADY_LEFT_COMMUNITY: { status: StatusCodes.BAD_REQUEST,"isSuccess": false,  code: "COMMUNITY4008", message: "이미 해당 커뮤니티를 탈퇴하였습니다." },
  INVALID_MEETING_DATE: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, code: "COMMUNITY4009", message: "미팅시간은 지금으로부터 적어도 30분이 지난 뒤로 설정해주세요." },
  

  // member err
  MEMBER_NOT_FOUND: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4001", "message": "사용자가 없습니다." },
  NICKNAME_NOT_EXIST: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4002", "message": "닉네임은 필수입니다." },
  FOLLOW_EXIST: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4003", "message": "이미 처리된 팔로우 혹은 본인입니다." },
  FOLLOW_NOT_FOUND: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4004", "message": "현재 팔로우 상태가 아닙니다." },
  DUPLICATE_ACCOUNT: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4005", "message": "아이디 중복" },

  // category err
  CATEGORY_NOT_FOUND: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "CATEGORY4001", "message": "존재하지 않는 카테고리입니다." },
  CATEGORY_COUNT_IS_WRONG: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "CATEGORY4002", "message": "카테고리 개수는 4~8개로 입력해주세요." },
  CATEGORY_DUPLICATED: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "CATEGORY4003", "message": "카테고리는 중복되지 않게 선택해주세요." },


  // shorts err
  SHORTS_TAG_COUNT_TOO_LONG: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "SHORTS4001", "message": "태그는 10개 이내로 입력해주세요." },
  SHORTS_TAG_TOO_LONG: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "SHORTS4002", "message": "태그는 10자 이내로 입력해주세요." },
  SHORTS_TITLE_TOO_LONG: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "SHORTS4003", "message": "제목은 30자 이내로 입력해주세요." },
  SHORTS_CONTENT_TOO_LONG: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "SHORTS4004", "message": "내용은 255자 이내로 입력해주세요." },
  SHORTS_PHRASE_TOO_LONG: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "SHORTS4005", "message": "책 구절은 150자 이내로 입력해주세요." },
  SHORTS_NOT_FOUND: { status: StatusCodes.NOT_FOUND, "isSuccess": false, "code": "SHORTS4006", "message": "존재하지 않는 쇼츠입니다." },

  // token err
  NOT_EXISTING_ACCESS_TOKEN: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "TOKEN4001", "message": "존재하지 않는 엑세스 토큰 입니다." },
  REFRESH_TOKEN_EXPIRED: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "TOKEN4002", "message": "만료된 리프레시 토큰 입니다." },
  ACCESS_TOKEN_NOT_EXPIRED: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "TOKEN4003", "message": "엑세스 토큰이 만료되지 않았습니다." },
  MISSING_TOKEN: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "TOKEN4004", "message": "헤더에 토큰 값이 존재하지 않습니다." },
  ACCESS_TOKEN_EXPIRED: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "TOKEN4005", "message": "엑세스 토큰이 만료되었습니다." },
  INVALID_REFRESH_TOKEN: { status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "TOKEN4005", "message": "유효하지 않는 리프레시 토큰입니다." }

};
