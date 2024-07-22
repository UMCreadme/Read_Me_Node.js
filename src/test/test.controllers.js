import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { pageInfo } from "../../config/pageInfo.js";
import { getErrorTest } from "./test.service.js";

export const getTest = (req, res, next) => {
    return res.send(response(status.SUCCESS));
}

export const getDataTest = (req, res, next) => {
    const data = "data";
    return res.send(response(status.SUCCESS, data));
}

export const paginationTest = (req, res, next) => {
    const data = "data";
    const pagination = pageInfo(1, 10, true); // 순서대로 page, size, hasNext
    return res.send(response(status.SUCCESS, data, pagination));
}

export const errorTest = async (req, res, next) => {
    res.send(response(status.SUCCESS, await getErrorTest(req.body)));
}