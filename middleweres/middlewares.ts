import { NextFunction, Request, Response } from "express";
import { getCache } from "../db/memcached";
import { paginateData } from "../utils/functions";

function checkCacheMyList(req: Request, res: Response, next: NextFunction) {
  const key: string = req.params.userId;
  if (!key || key.length < 24) {
    res.status(400).json({ error: "invalid userId" });
    return;
  }

  getCache(key, (err: Error, data: any) => {
    if (err) {
      return next();
    }

    if (data) {
      const page = Number(req.query.page) || 0;

      data = paginateData(page, JSON.parse(data));

      res.send(data);
    } else {
      next();
    }
  });
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.sendStatus(401);
  }

  const [username, password] = authHeader.split(" ");
  if (username !== "suman" || password !== "password") {
    return res.sendStatus(401);
  }

  // The user is authenticated
  next();
};

export { checkCacheMyList, authenticate };
