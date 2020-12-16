import { ServerRequest } from "https://deno.land/std@0.81.0/http/server.ts";

export default class Response{
    private req : ServerRequest
    private headers = new Headers
    private code = 200 
    constructor(req : ServerRequest){
        this.req = req
    }

    header(name : string, value : string){
        this.headers.set(name, value)
        return this
    }

    status(code : number){this.code=code}

    end(data : any){
        this.req.respond({
            body : `${data}`,
            headers : this.headers,
            status : this.code
        })
    }
    
}