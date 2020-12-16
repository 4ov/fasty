import Request from "../request.ts"
import Response from "../response.ts"
import {existsSync} from "https://deno.land/std@0.81.0/fs/exists.ts"
import * as Path from "https://deno.land/std@0.81.0/path/mod.ts";
import { Callback } from "../types.ts";







export default function(path : string, fallback : Callback) {
    function serve(req : Request, res : Response, next : any) {
        if(req.url.pathname == '/')req.url.pathname='/index.html'
        
        if(existsSync(Path.join(Deno.cwd(), path, req.url.pathname))){
            res.end(Deno.readTextFileSync(Path.join(Deno.cwd(), path, req.url.pathname)))
        }else{
            fallback(req, res, next)
        }
    };
    return serve
};

