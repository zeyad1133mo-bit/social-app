
import { Request,NextFunction,Response } from "express";
import {cacheProvider} from "./init.js";

// get data products >> 200
// cache register

export function withCache(ttl = 3600) {
    return async (req:Request, res:Response, next:NextFunction) => {
        // request
        // method + url
        // "GET:/products" :"[{},{},{},...]"
        let key = `${req.method}:${req.originalUrl}:${req.user?.sub ?? 'anon'}`;

        // /api >> /user >> /
        // req.url >> '/'
        // req.originalUrl >> '/api/user/'
        const cached = await cacheProvider.get(key);
        if (cached) {
            res.setHeader('X-Cache', "HIT");
            return res.json(JSON.parse(cached));
        }
        // interceptor
        // res.json(body) >> send client response
        // res.json(body) >> cache + send client response
        // get deep copy from implementation res.json before modify
        const originalJson = res.json.bind(res);
        // bind()
        // 1. create a new instance function
        // 2. bind this to res.json >> res() === res.json()
        // res.json() >> res() >> originalJson(body);

        res.json = ((body) => {
            if (res.statusCode >=200 && res.statusCode < 300) {
                // 1. cache body >> "{message:"",success:true,data:[{},{}]}"
                 cacheProvider.set(key, JSON.stringify(body), ttl);
                // 2. send response
                res.setHeader('X-Cache', "MISS");
            }
            return originalJson(body);// cache + re.json >> cache + res.json >> cache + res.json >> ...
        });

        next();
    }
}