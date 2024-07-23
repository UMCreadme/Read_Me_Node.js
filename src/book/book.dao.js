import {pool} from "../../config/db.config.js";
import {getBookById} from "./book.sql.js";

export const findBookById = async (bookId) => {

    const conn = await pool.getConnection();
    const [book] = await pool.query(getBookById, bookId)

    conn.release();

    return book[0];
}