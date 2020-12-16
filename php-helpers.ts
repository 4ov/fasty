import Request from "./request.ts";
import Response from "./response.ts";

import * as utils from './utils.ts'

export default function phpHelpers(req : Request, res : Response) {
    
    let obj = {
        header(name : string, value : string){res.header(name, value)},
        status(code : number){res.status(code)},
       get request(){return req},
       ...utils
    }
    
    return obj
};
