
import { ServerRequest } from "https://deno.land/std@0.81.0/http/server.ts";
import { parseQuery } from "./utils.ts";

export default class Request{
    raw : ServerRequest
    params : any
    method : string
    // @ts-ignore    
    url : URL
    [key : string] : any
    constructor(req : ServerRequest, passedData : any) {
        this.raw = req
        this.method = req.method
        const self = this
        Object.keys(passedData).map(k=>(self as any)[k]=(passedData as any)[k])
        
    }

    get body(){
        const self = this
        return {
            async json(){return JSON.parse( new TextDecoder().decode(await Deno.readAll(self.raw.body)) )  }
        }
    }

    get query(){
        return  parseQuery(this.raw.url)
    }
    
}