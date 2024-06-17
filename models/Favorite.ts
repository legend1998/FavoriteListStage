import { Schema, model } from "mongoose";

interface Ifavorite {
  userId: String;
  movieOrShowId: String;
  type: String;
}

enum ContenttypeEnums {
  Movie = "Movie",
  TvShow = "TvShow",
}

const favoriteSchema = new Schema<Ifavorite>(
  {
    userId: { type: Schema.ObjectId, required: true },
    movieOrShowId: { type: Schema.ObjectId, required: true },
    type: { type: String, required: true, enum: ContenttypeEnums },
  },
  { timestamps: true }
);

export default model<Ifavorite>("Favorite", favoriteSchema);
