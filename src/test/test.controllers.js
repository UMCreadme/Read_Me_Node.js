import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { pageInfo } from "../../config/pageInfo.js";

export const getTest = (req, res, next) => {
    return res.send(response(status.SUCCESS));
}

export const getDataTest = (req, res, next) => {
    return res.send(response(status.SUCCESS, "SUCCESS"));
}

export const paginationTest = (req, res, next) => {
    const data = "data";
    const pagination = pageInfo(1, 10, 100, 10);
    return res.send(response(status.SUCCESS, data, pagination));
}