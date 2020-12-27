
export const parseCookie = (str : string) =>
  str
    ?.split(';')
    ?.map(v => v.split('='))
    ?.reduce((acc, v) => {
      (acc as any)[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1]?.trim());
      return acc;
    }, {});


const tc = (def:any, fn:any) =>{
  try{return fn()}
  catch(e){return def}
}

export const  parseQuery = (str : any) =>{
  str= str=='?' ? '' : str?.split("?")?.[1]?.split("&")?.map((e:any)=>e.split('=')) || []
  return tc({}, ()=>Object.assign({}, ...str.map(([k, v] : [any, any]) => ({ [k]: v  || null}))) )
}