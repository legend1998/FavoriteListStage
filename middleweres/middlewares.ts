import { NextFunction, Request, Response } from "express";
import { getCache } from "../db/memcached";
import { paginateData } from "../utils/functions";
import basicAuth from "basic-auth";

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

const mUser = { username: "suman", pass: "mypass" };

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const user = basicAuth(req);
  if (!authHeader && !user) {
    return res.sendStatus(401);
  }
  console.log(user?.name, user?.pass, "okay here is the basic auth");
  if (user) {
    if (!user || user.name !== mUser.username || user.pass !== mUser.pass) {
      res.set("WWW-Authenticate", 'Basic realm="example"');
      return res.status(401).send("Authentication required.");
    }
  } else if (authHeader) {
    const [username, password] = authHeader.split(" ");
    if (username !== mUser.username || password !== mUser.pass) {
      return res.sendStatus(401);
    }
  }

  // The user is authenticated
  next();
};

export { checkCacheMyList, authenticate };
