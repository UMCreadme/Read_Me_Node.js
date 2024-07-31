import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { pageInfo } from "../../config/pageInfo.js";
import { getErrorTest } from "./test.service.js";
import { BaseError } from "../../config/error.js";

export const getTest = (req, res, next) => {
    res.send(response(status.SUCCESS));
}

export const getDataTest = (req, res, next) => {
    const data = "data";
    return res.send(response(status.SUCCESS, data));
}

export const paginationTest = (req, res, next) => {
    const data = "data";
    const pagination = pageInfo(1, 10, true); // 순서대로 page, size, hasNext
    res.send(response(status.SUCCESS, data, pagination));
}

export const imageTest = async (req, res, next) => {
    res.send(response(status.CREATED, req.file.location));
}

export const errorTest = async (req, res, next) => {
    if(req.query.condition === "controller") {
        throw new BaseError(status.MEMBER_NOT_FOUND);
    }

    res.send(response(status.SUCCESS, await getErrorTest(req.query.condition)));
}