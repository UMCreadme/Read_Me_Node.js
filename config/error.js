import { status } from "./response.status.js";

export class BaseError extends Error {
    constructor(data){
        if(data == null || data == undefined) {
            data = status.INTERNAL_SERVER_ERROR;
        };
        
        super(data.message);
        this.data = data;
    }
}