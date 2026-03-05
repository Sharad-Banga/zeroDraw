import { NextFunction  ,Request , Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config"

export function middleware(req:Request , res: Response , next :NextFunction){

  try{
        const token = req.headers["authorization"] ?? "";
      console.log("Token:", token);
      

      const decoded = jwt.verify(token , JWT_SECRET);
      console.log(JWT_SECRET);
      console.log(decoded);
      
      

      if((decoded as JwtPayload).userId){
          // @ts-ignore
          req.userId = decoded.userId;
          next();
      }
      else{
          res.status(403).json({
            message : "Unauth"
          })
      }
  }
  catch(e){
      console.log("Auth error:", e);    
      res.status(403).json({
        message : "invalid token"
      })
  }

}