import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class ParseJwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log("Request...", req);
    if (req.get("Authorization")) {
      // req.body.user = await this.jwtService.decode()
    }

    next();
  }
}
