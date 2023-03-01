// import {setupServer} from 'msw/node';
// import {HandleRequestOptions, Path, rest, } from "msw";

// interface IHandlerConfig{
//     method : string;
//     path: Path;
//     res:()=> {}
// }

// export  const createServer=(handlerConfig:IHandlerConfig[])=>{
//     const handlers = handlerConfig.map((config)=>{
//         return rest[config.method](config.path, (req,res, ctx)=>{
//             return res(ctx.json(config.res(req,res,ctx)))
//         })
//     })
//     const server = setupServer(...handlers)

// }

export {}