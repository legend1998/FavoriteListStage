import mongoose from "mongoose";
import Favorite from "../models/Favorite";
import { getCache, setCache } from "../db/memcached";

function getAggregateMyList(userId: string, limit?: number) {
  if (!limit) limit = 1000;
  return Favorite.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "movies",
        foreignField: "_id",
        localField: "movieOrShowId",
        pipeline: [{ $project: { title: 1, description: 1, genres: 1 } }],
        as: "movies",
      },
    },
    { $unwind: { path: "$movies", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "tvshows",
        foreignField: "_id",
        localField: "movieOrShowId",
        pipeline: [{ $project: { title: 1, description: 1, genres: 1 } }],
        as: "shows",
      },
    },
    { $unwind: { path: "$shows", preserveNullAndEmptyArrays: true } },
  ]);
}

async function saveItemToCache(userId: string) {
  const item = await getAggregateMyList(userId, 1);

  getCache(userId, (err: Error, value: string) => {
    if (err) return;
    if (value) {
      let data: any[] = JSON.parse(value);
      data.unshift(item);
      setCache(userId, JSON.stringify(data));
    }
  });
}

async function removeFromCache(id: string, userId: string) {
  getCache(userId, (err: Error, value: string) => {
    if (err) return;
    if (value) {
      let data: any[] = JSON.parse(value);
      data = data.filter((item) => item._id != id);
      setCache(userId, JSON.stringify(data));
    }
  });
}

export { getAggregateMyList, saveItemToCache, removeFromCache };
