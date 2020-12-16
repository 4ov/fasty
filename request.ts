
import { ServerRequest } from "https://deno.land/std@0.81.0/http/server.ts";

export default class Request{
    raw : ServerRequest
    params : any
    // @ts-ignore    
    url : URL
    constructor(req : ServerRequest, passedData : any) {
        this.raw = req
        const self = this
        Object.keys(passedData).map(k=>(self as any)[k]=(passedData as any)[k])
    }
}