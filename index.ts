import { Callback, HttpMethods, HttpMiddleware, HttpRule } from "./types.ts"
import { serve, ServerRequest } from "https://deno.land/std@0.81.0/http/server.ts";
import Middleware from './middleware.js'
import { urlParse } from 'https://deno.land/x/url_parse/mod.ts';
import Request from "./request.ts";
import Response from "./response.ts";
import staticMw from './middlewares/static.ts'
import compiler from "./middlewares/template.ts";
import phpHelpers from "./php-helpers.ts";


(String as any).prototype.equal = function(str : string){
    return { match : this == str, result : [str]}
};

(RegExp as any).prototype.equal = function(str : string){
    return{
        match : this.test(str),
        result : this.exec(str)
    }
};

export default class Server{
    port : number
    options : any
    rules : HttpRule[] = []
    middlewares : HttpMiddleware[] = []
    s : any
    fallback = (req : ServerRequest)=>{
        req.respond({
            body : `Cannot ${req.method} ${req.url}`
        })
    }
    constructor(port : number, options? : any){
        this.port = port
        this.options = options
    }


    private generateRule(method : HttpMethods, path : string | RegExp, callbacks : Callback[]){
       var params = null
        if (path == '*'){
           path = /.*/
       }
       if(typeof path == 'string' && (path as string).match(/\{(.*)\}/)){
            params = (path as string).match(/\{(.*)\}/)?.slice(1)
            path = new RegExp(path.replaceAll(/\{(.*?)\}/g, '(.*?)'))
       }
        return<HttpRule>{
            method,
            path,
            callbacks,
            params
        }
    }

    private generateMiddleware(path : string | RegExp | null, callbacks : Callback[]){
        var params = null
         if (path == '*'){
            path = /.*/
        }
        if(typeof path == 'string' && (path as string).match(/\{(.*)\}/)){
             params = (path as string).match(/\{(.*)\}/)?.slice(1)
            path = new RegExp(path.replaceAll(/\{(.*?)\}/g, '(.*?)'))
        }
         return<HttpMiddleware>{
             path,
             callbacks,
             params
         }
     }

    get(path : string | RegExp, ...callbacks : Callback[]){
        this.rules.push(this.generateRule('GET', path, callbacks))
    }
    
    post(path : string | RegExp, ...callbacks : Callback[]){
        this.rules.push(this.generateRule('POST', path, callbacks))
    }


    handle(req : ServerRequest){
        let tries = 0
        const url = urlParse(`${req.headers.get('proto') || 'http'}://${req.headers.get('host')}${req.url}`)
        //generate middleware system
        

        if(!this.rules.some(rule=>{
            if(rule.method == req.method && (rule.path as any).equal(url.pathname).match){
                console.log(rule);
                
                const params : any = {}
                rule.params?.map((r, i)=>{
                    params[r] = (rule.path as any).equal(url.pathname).result.slice(1)[i]
                })
                const Req = new Request(req, {
                    url,
                    params
                })

                const Res = new Response(req)

                

                const MW = new Middleware(Req, Res)
                this.middlewares.forEach(mid=>{  
                    if((mid.path as any).equal(url.pathname) || mid.path == null){
                        mid.callbacks.forEach(cb=>MW.use(cb))
                    }
                })
                rule.callbacks.forEach(cb=>MW.use(cb))
                MW.go(()=>true)
                return true
            }else{
                return false
            }
        })){
            this.fallback(req)
        }
       
        
    }



    use(path : RegExp | string | null, ...callbacks : Callback[]){
        this.middlewares.push(this.generateMiddleware(path, callbacks))
    }



    async start(){
        this.s = serve({port : this.port})
        for await (const req of this.s) {
            this.handle(req)
          }
    }


}


