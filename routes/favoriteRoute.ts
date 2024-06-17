import { NextFunction, Request, Response, Router } from "express";
import Favorite from "../models/Favorite";
import mongoose, { Mongoose } from "mongoose";
import { deleteCache, setCache } from "../db/memcached";
import { checkCacheMyList, authenticate } from "../middleweres/middlewares";
import { paginateData } from "../utils/functions";
import {
  getAggregateMyList,
  removeFromCache,
  saveItemToCache,
} from "../queries/queries";
import { CustomError } from "../errorhandler";

const router = Router();

router.get(
  "/:userId",
  authenticate,
  checkCacheMyList,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { page } = req.query;

      let pageNumber = Number(page) || 0;

      const data = await getAggregateMyList(userId);
      setCache(userId, JSON.stringify(data));

      res.status(200).json(paginateData(pageNumber, data));
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        userId,
        contentId: movieOrShowId,
        type,
      }: { userId?: string; contentId?: string; type?: string } = req.query;

      if (!userId || !movieOrShowId || !type) {
        throw new CustomError(
          "Missing query params 'userId' or 'contentId' or 'type'",
          400
        );
      }
      if (userId.length < 24 || movieOrShowId.length < 24) {
        throw new CustomError("invalid 'userId' or 'contentId'", 400);
      }

      const fav = await Favorite.findOne({
        userId: new mongoose.Types.ObjectId(String(userId)),
        movieOrShowId: new mongoose.Types.ObjectId(String(movieOrShowId)),
      });

      if (fav) {
        res.status(200).json({ id: fav._id, exists: true });
        return;
      }

      const favorite = new Favorite({ userId, movieOrShowId, type });
      const saved = await favorite.save();

      saveItemToCache(String(userId));

      res.status(200).json({ id: saved._id, exists: false });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, userId }: { id?: string; userId?: string } = req.query;

      if (!id || !userId) {
        throw new CustomError("Missing item's 'id' params or 'userId'", 400);
      }

      if (id!.length < 24 || userId.length < 24) {
        throw new CustomError("invalid item's 'id' or 'userId'", 400);
      }

      const result = await Favorite.deleteOne({
        _id: new mongoose.Types.ObjectId(String(id)),
      });

      if (result.deletedCount) {
        removeFromCache(id as string, userId as string);
      }

      res
        .status(200)
        .json({ deleted: result.acknowledged && result.deletedCount });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
