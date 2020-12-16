import _ld from 'https://esm.sh/lodash'
import Request from "../request.ts";
import Response from "../response.ts";
const _ = _ld as any
//_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

_.templateSettings = {
    evaluate: /\<\?([\s\S]+?)\?\>/g,
    interpolate: /{{([\s\S]+?)}}/g,
    escape: /\{\{-(.+?)\}\}/g
};


function compiler(template : string, params : any, imports? : any){
    var compiled = _.template(template, {imports});
    let c = compiled(params);
    return c
}



export default compiler



