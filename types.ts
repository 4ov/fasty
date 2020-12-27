import Request from "./request.ts"
import Response from "./response.ts"


export type HttpMethods = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'PATCH' | 'ALL'

export type Callback = (req : Request, res : Response, next? : any)=>unknown

export type HttpRule = {
    path : string | RegExp,
    method : HttpMethods,
    params? : string[],
    callbacks : Callback[]
}

export type HttpMiddleware = {
    path : string | RegExp | null,
    params? : string[] | null
    callbacks : Callback[]
}