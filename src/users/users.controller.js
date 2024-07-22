import express from "express";
import {response} from "../../config/response.js";
import {status} from "../../config/response.status.js";
import {findOne, findUserShorts, findUserLikeShorts, findUserBooks} from "./users.service.js";

// 유저 정보 조회
export const getUserInfo = async (req, res, next) => {
    res.send(response(status.SUCCESS , await findOne(req.body)))
}

// 유저가 만든 쇼츠 리스트 조회
export const getUserShorts = async(req, res, next)=> {
    res.send(response(status.SUCCESS, await findUserShorts(req.body)))
}

//유저가 찜한 쇼츠 리스트 조회
export const getUserLikeShorts = async(req, res, next) => {
    res.send(response(status.SUCCESS, await findUserLikeShorts(req.body)))
}

// 유저가 읽은 책 리스트 조회
export const getUserBooks = async(req, res, next)=> {
    res.send(response(status.SUCCESS, await findUserBooks(req.body)))
}