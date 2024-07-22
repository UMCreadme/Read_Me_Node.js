import express from "express";
import {findById, findUserShortsById, findUserLikeShortsById, findUserBooksById } from "./users.dao.js";
import {userBookResponseDTO, userInfoResponseDTO, userShortsResponseDTO} from "./users.dto.js";
import {findFollowerNumByUserId, findFollowingNumByUserId} from "../follow/follow.dao.js";
import {findBookById} from "../book/book.dao.js";

// 유저 정보 조회 로직
export const findOne = async(body) => {
    const userId = body.id;
    const userData = await findById(userId)

    const followingNum = await findFollowingNumByUserId(userId);
    const followerNum = await findFollowerNumByUserId(userId);

    return userInfoResponseDTO( userData, followerNum, followingNum );
}


// 유저가 만든 쇼츠 리스트 조회 로직
export const findUserShorts = async(body) => {
    const userId = body.id;
    const userShorts = await findUserShortsById(userId);
    const userShortsResponseDTOList = [];


    for (const userShort of userShorts) {
        let userShortsBook = await findBookById(userShort.book_id);
        let result = userShortsResponseDTO(userShort, userShortsBook.title, userShortsBook.author);
        userShortsResponseDTOList.push(result);
    }

    return userShortsResponseDTOList
}

// 유저가 찜한 쇼츠 리스트 조회 로직
export const findUserLikeShorts = async(body) => {
    const userId = body.id
    const userLikeShorts = await findUserLikeShortsById(userId);
    const userShortsResponseDTOList = [];

    for (const userLikeShort of userLikeShorts) {
        let userLikeShortsBook = await findBookById(userLikeShort.book_id);
        let result = userShortsResponseDTO(userLikeShort, userLikeShortsBook.title, userLikeShortsBook.author);
        userShortsResponseDTOList.push(result)
    }

    return userShortsResponseDTOList
}

// 유저가 읽은 책 리스트 조회 로직
export const findUserBooks = async(body) => {
    const userId = body.id
    const userBooks = await findUserBooksById(userId);
    const userBookResponseDTOList = [];

    for (const userBook of userBooks) {
        let result = userBookResponseDTO(userBook);
        userBookResponseDTOList.push(result);
    }

    return userBookResponseDTOList;
}